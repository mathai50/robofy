import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Valid deployment token
const DEPLOY_TOKEN = 'JSonzMF_ThkwGksRC1nyb';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Check if the token matches
    if (params.token !== DEPLOY_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid deployment token' },
        { status: 401 }
      );
    }

    // Trigger deployment in background
    setImmediate(async () => {
      try {
        console.log('Starting deployment...');

        // Pull latest changes
        await execAsync('git pull origin main');
        console.log('Git pull completed');

        // Install dependencies
        await execAsync('npm ci --omit=dev');
        console.log('Dependencies installed');

        // Generate content
        await execAsync('npm run generate:content');
        console.log('Content generated');

        // Build application
        await execAsync('npm run build');
        console.log('Build completed');

        // Restart application (assuming PM2)
        await execAsync('pm2 restart robofy || pm2 start npm --name "robofy" -- start');
        console.log('Application restarted');

        console.log('Deployment completed successfully');
      } catch (error) {
        console.error('Deployment failed:', error);
      }
    });

    return NextResponse.json({
      message: 'Deployment triggered successfully',
      status: 'in_progress'
    });

  } catch (error) {
    console.error('Deployment trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger deployment' },
      { status: 500 }
    );
  }
}