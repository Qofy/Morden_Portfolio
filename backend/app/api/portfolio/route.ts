import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    // Get user from stored auth data
    const data = await request.json();

    // For now, we'll rely on the user being sent in the request
    // In production, you'd want to implement proper JWT tokens
    if (!data.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }

    const db = getDb();

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(data.userId) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const portfolio = db.prepare('SELECT id FROM portfolios WHERE user_id = ?').get(user.id) as any;

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    db.prepare(`
      UPDATE portfolios
      SET name = ?, title = ?, location = ?, bio = ?, photo = ?, resume_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.personal?.name || '',
      data.personal?.title || '',
      data.personal?.location || '',
      data.personal?.bio || '',
      data.personal?.photo || '',
      data.personal?.resumeUrl || '',
      portfolio.id
    );

    db.prepare('DELETE FROM work_experience WHERE portfolio_id = ?').run(portfolio.id);
    if (data.workExperience && Array.isArray(data.workExperience)) {
      const workStmt = db.prepare(`
        INSERT INTO work_experience (portfolio_id, period, position, company, location, description, tags, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      data.workExperience.forEach((work: any, index: number) => {
        workStmt.run(
          portfolio.id,
          work.period || '',
          work.position || '',
          work.company || '',
          work.location || '',
          JSON.stringify(work.description || []),
          JSON.stringify(work.tags || []),
          index
        );
      });
    }

    db.prepare('DELETE FROM education WHERE portfolio_id = ?').run(portfolio.id);
    if (data.education && Array.isArray(data.education)) {
      const eduStmt = db.prepare(`
        INSERT INTO education (portfolio_id, period, degree, institution, location, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      data.education.forEach((edu: any, index: number) => {
        eduStmt.run(
          portfolio.id,
          edu.period || '',
          edu.degree || '',
          edu.institution || '',
          edu.location || '',
          JSON.stringify(edu.description || []),
          index
        );
      });
    }

    db.prepare('DELETE FROM projects WHERE portfolio_id = ?').run(portfolio.id);
    if (data.projects && Array.isArray(data.projects)) {
      const projectStmt = db.prepare(`
        INSERT INTO projects (portfolio_id, title, description, technologies, image, live_url, github_url, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      data.projects.forEach((project: any, index: number) => {
        projectStmt.run(
          portfolio.id,
          project.title || '',
          project.description || '',
          JSON.stringify(project.technologies || []),
          project.image || '',
          project.liveUrl || '',
          project.githubUrl || '',
          index
        );
      });
    }

    db.prepare('DELETE FROM skills WHERE portfolio_id = ?').run(portfolio.id);
    if (data.skills) {
      const skillStmt = db.prepare(`
        INSERT INTO skills (portfolio_id, category, skill_name)
        VALUES (?, ?, ?)
      `);

      Object.entries(data.skills).forEach(([category, skills]: [string, any]) => {
        if (Array.isArray(skills)) {
          skills.forEach((skill: string) => {
            skillStmt.run(portfolio.id, category, skill);
          });
        }
      });
    }

    db.prepare('DELETE FROM social_links WHERE portfolio_id = ?').run(portfolio.id);
    if (data.socialLinks && Array.isArray(data.socialLinks)) {
      const socialStmt = db.prepare(`
        INSERT INTO social_links (portfolio_id, name, icon, url, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `);
      data.socialLinks.forEach((link: any, index: number) => {
        socialStmt.run(
          portfolio.id,
          link.name || '',
          link.icon || '',
          link.url || '',
          index
        );
      });
    }

    return NextResponse.json({ message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
