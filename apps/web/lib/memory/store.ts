import fs from 'fs/promises';
import path from 'path';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
}

export interface UserMemory {
  userId: string;
  messages: Message[];
  updatedAt: string;
}

const MEMORY_FILE = path.join(process.cwd(), 'memory.json');

// Inicializa el archivo si no existe
async function initMemory() {
  try {
    await fs.access(MEMORY_FILE);
  } catch {
    await fs.writeFile(MEMORY_FILE, JSON.stringify({}), 'utf-8');
  }
}

export async function getUserHistory(userId: string): Promise<Message[]> {
  await initMemory();
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf-8');
    const memory = JSON.parse(data);
    return memory[userId]?.messages || [];
  } catch (error) {
    console.error('Error reading memory:', error);
    return [];
  }
}

export async function saveUserHistory(userId: string, messages: Message[]) {
  await initMemory();
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf-8');
    const memory = JSON.parse(data);
    
    memory[userId] = {
      userId,
      messages,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}
