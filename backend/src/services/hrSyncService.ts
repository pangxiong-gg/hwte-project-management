import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

interface HrUser {
  email: string;
  name: string;
  division_code: string;
  team_code?: string;
  role: string;
}

export async function syncFromCSV(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const records: HrUser[] = await parseCSV(fileContent);

  const results = {
    created: 0,
    updated: 0,
    errors: [] as string[]
  };

  for (const record of records) {
    try {
      // Find Organization by division code
      const division = await prisma.division.findFirst({
        where: { code: record.division_code },
        include: { organization: true }
      });

      if (!division) {
        results.errors.push(`Division not found: ${record.division_code}`);
        continue;
      }

      // Find or create Team
      let team = null;
      if (record.team_code) {
        team = await prisma.team.findFirst({
          where: { code: record.team_code, department: { divisionId: division.id } }
        });
      }

      // Create or update user
      const hashedPassword = await bcrypt.hash('TempPass123', 10);
      const existingUser = await prisma.user.findUnique({ where: { email: record.email } });

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: record.name,
            divisionId: division.id,
            teamId: team?.id,
            deletedAt: null
          }
        });
        results.updated++;
      } else {
        await prisma.user.create({
          data: {
            email: record.email,
            name: record.name,
            password: hashedPassword,
            orgId: division.organization.id,
            divisionId: division.id,
            teamId: team?.id,
            roles: {
              create: {
                role: { connect: { name: record.role } },
                scope: 'ORG',
                scopeId: division.organization.id
              }
            }
          }
        });
        results.created++;
      }
    } catch (error: any) {
      results.errors.push(`Error processing ${record.email}: ${error.message}`);
    }
  }

  // Record Sync Log
  await prisma.hrSyncLog.create({
    data: {
      syncType: 'FULL',
      status: results.errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
      recordCount: records.length
    }
  });

  return results;
}

async function parseCSV(content: string): Promise<HrUser[]> {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const records: HrUser[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const record: any = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record as HrUser);
  }

  return records;
}

export async function getSyncLogs() {
  return prisma.hrSyncLog.findMany({
    orderBy: { startedAt: 'desc' },
    take: 20
  });
}