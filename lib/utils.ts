import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path:string){
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}


export function generateId(){
  const alphabet = '0123456789_abcdefghijklmnopqrstuvwxyz-';
  const nanoid = customAlphabet(alphabet, 13);
  let id = nanoid() //=> "rw98h"
  return id
}