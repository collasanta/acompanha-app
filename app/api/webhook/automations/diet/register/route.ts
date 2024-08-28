import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// http:localhost:3000/api/webhook/automations/diet/register?automationId=1

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const automationId = searchParams.get('automationId');

    if (!automationId) {
      return NextResponse.json({ error: 'AutomationId is required as a query parameter' }, { status: 400 });
    }

    const body = await req.json();
    const { submittedAt, ...responses } = body;

    // Fetch the automation rules
    const automation = await prismadb.dietAutomation.findUnique({
      where: { id: automationId },
    });

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    // Parse the rules
    const rules = JSON.parse(automation.rule);

    // Process the responses and apply the rules
    // This is a mock implementation. You'll need to replace this with your actual logic.
    const processedResponse = processResponses(responses, rules);

    // Save the run in the database
    const run = await prismadb.dietAutomationRun.create({
      data: {
        automationId: automationId,
        professionalId: automation.professionalId,
        clientId: responses.clientId || 'mock_client_id', // Assuming clientId might be in the responses
        dietId: processedResponse.dietId,
        clientClonedDietId: processedResponse.dietId, // Assuming it's the same for now
        receivedResponses: JSON.stringify(responses),
      },
    });

    return NextResponse.json({
      message: 'Webhook received and processed successfully',
      processedResponse,
      runId: run.id,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function processResponses(responses: Record<string, any>, rules: Record<string, any>) {
  // This is a mock implementation. Replace with your actual logic.
  let totalCalories = 0;

  // Calculate total calories based on responses
  if (responses.weight && responses.height) {
    const weight = parseFloat(responses.weight);
    const height = parseFloat(responses.height);
    const bmi = weight / ((height / 100) ** 2);
    totalCalories = bmi * 100; // This is just a mock calculation
  }

  // Find the appropriate diet based on calculated calories
  let selectedDietId = '';
  for (const [calories, dietId] of Object.entries(rules)) {
    if (totalCalories <= parseInt(calories)) {
      selectedDietId = dietId as string;
      break;
    }
  }

  // If no diet matches, use the last one (highest calorie diet)
  if (!selectedDietId) {
    selectedDietId = rules[Object.keys(rules)[Object.keys(rules).length - 1]];
  }

  return {
    calculatedCalories: totalCalories,
    dietId: selectedDietId,
    // Add any other relevant information here
  };
}