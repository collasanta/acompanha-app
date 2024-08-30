import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { generateId } from '@/lib/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: { automationId: string } }
) {
  try {
    const body = await req.json();
    console.log(body);
    const { automationId } = params;
    if (!automationId) {
      return NextResponse.json({ error: 'AutomationId is required' }, { status: 400 });
    }

    const automation = await getAutomation(automationId);
    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    const client = await getOrCreateClient(body, automation.professionalId);
    const calculatedCalories = calculateCalories(body);
    const rules = JSON.parse(automation.rule);
    const selectedDietId = selectDiet(calculatedCalories, rules);
    
    const { templateDiet, clonedDiet } = await cloneDietForClient(selectedDietId, client, automation.professionalId);
    
    const run = await createDietAutomationRun(automation, client, templateDiet, clonedDiet, body);
    await appendRestrictionsToClientInfo(client.id, body.restrictions, body.restriction2details);
    return NextResponse.json({
      message: 'Diet automation webhook processed successfully',
      runId: run.id,
      clientId: client.id,
      calculatedCalories,
      selectedDietId: templateDiet.id,
      clonedDietId: clonedDiet.id,
    });

  } catch (error) {
    console.error('Error processing diet automation webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAutomation(automationId: string) {
  return prismadb.dietAutomation.findUnique({
    where: { id: automationId },
  });
}

async function getOrCreateClient(data: any, professionalId: string) {
  const clientData = {
    name: data.name,
    whatsapp: data.whatsapp,
    email: data.email,
    genre: data.gender,
    age: parseInt(data.age),
    professionalId: professionalId,
  };

  let client = await prismadb.client.findFirst({
    where: {
      OR: [
        { email: clientData.email },
        { whatsapp: clientData.whatsapp },
      ],
      professionalId: professionalId,
    },
  });

  if (!client) {
    client = await prismadb.client.create({
      data: {
        id: generateId(),
        ...clientData,
      },
    });
  }

  return client;
}

function calculateCalories(data: any): number {
  let TMB: number;
  if (data.gender === 'masculino') {
    TMB = 66 + (13.8 * parseFloat(data.weight)) + (5 * parseFloat(data.height)) - (6.8 * parseInt(data.age));
  } else {
    TMB = 655 + (9.6 * parseFloat(data.weight)) + (1.8 * parseFloat(data.height)) - (4.7 * parseInt(data.age));
  }

  const activityFactors: { [key: string]: number } = {
    'uma vez': 1.2,
    'duas ou três vezes': 1.5,
    'mais que quatro vezes': 1.8,
  };
  const factor = activityFactors[data.activitiesfrequency] || 1.2;
  let TMBFATOR = TMB * factor;

  if (data.goal === 'Ganho de Massa') {
    TMBFATOR += 1000;
  } else if (data.goal === 'Emagrecimento / Definição') {
    TMBFATOR -= 1000;
  }

  return Math.round(TMBFATOR);
}

function selectDiet(calories: number, rules: { [key: string]: string }): string {
  const sortedCalories = Object.keys(rules).map(Number).sort((a, b) => a - b);
  for (const cal of sortedCalories) {
    if (calories <= cal) {
      return rules[cal.toString()];
    }
  }
  return rules[sortedCalories[sortedCalories.length - 1].toString()];
}

async function cloneDietForClient(dietId: string, client: any, professionalId: string) {
  const templateDiet = await prismadb.dietPlan.findUnique({ where: { id: dietId } });
  if (!templateDiet) {
    throw new Error('Selected diet template not found');
  }

  const clonedDiet = await prismadb.dietPlan.create({
    data: {
      id: generateId(),
      name: templateDiet.name,
      content: templateDiet.content,
      professionalId: professionalId,
      clientId: client.id,
    },
  });

  await prismadb.client.update({
    where: { id: client.id },
    data: {
      currentDietPlanId: clonedDiet.id,
    },
  });

  return { templateDiet, clonedDiet };
}

async function createDietAutomationRun(automation: any, client: any, templateDiet: any, clonedDiet: any, responseData: any) {
  return prismadb.dietAutomationRun.create({
    data: {
      id: generateId(),
      automationId: automation.id,
      professionalId: automation.professionalId,
      clientId: client.id,
      dietId: templateDiet.id,
      clientClonedDietId: clonedDiet.id,
      receivedResponses: JSON.stringify(responseData),
    },
  });
}

async function appendRestrictionsToClientInfo(clientId: string, restrictions: string, restriction2details: string) {
  if (restrictions === 'Não' && !restriction2details) { 
    return
  }
  try {
    // Fetch the current client info
    const client = await prismadb.client.findUnique({
      where: { id: clientId },
      select: { info: true }
    });

    if (!client) {
      throw new Error('Client not found');
    }

    // Parse the existing info
    let infoDoc = JSON.parse(client.info || '{"type":"doc","content":[]}');

    // Create a new paragraph for restrictions
    const restrictionsParagraph = {
      type: "paragraph",
      attrs: { class: null, textAlign: "left" },
      content: [
        { type: "text", text: "Restrições: ", marks: [{ type: "bold" }] },
      ]
    };

    //@ts-ignoreL
    restrictions !== "Não" && restrictionsParagraph.content.push({ type: "text", text: `Condição: ${restrictions}` });
    //@ts-ignoreL
    restriction2details && restrictionsParagraph.content.push({ type: "text", text: `Detalhes: ${restriction2details}`});


    // Append the new paragraph to the content
    infoDoc.content.push(restrictionsParagraph);

    // Update the client info in the database
    await prismadb.client.update({
      where: { id: clientId },
      data: { info: JSON.stringify(infoDoc) }
    });

    console.log('Client info updated successfully');
  } catch (error) {
    console.error('Error updating client info:', error);
  } finally {
    await prismadb.$disconnect();
  }
}

