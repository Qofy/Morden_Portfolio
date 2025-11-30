import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const db = getDb();

    const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE user_id = ?').get(user.id) as any;

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const workExperience = db.prepare(
      'SELECT * FROM work_experience WHERE portfolio_id = ? ORDER BY sort_order DESC'
    ).all(portfolio.id);

    const education = db.prepare(
      'SELECT * FROM education WHERE portfolio_id = ? ORDER BY sort_order DESC'
    ).all(portfolio.id);

    const projects = db.prepare(
      'SELECT * FROM projects WHERE portfolio_id = ? ORDER BY sort_order DESC'
    ).all(portfolio.id);

    const skillsRaw = db.prepare(
      'SELECT * FROM skills WHERE portfolio_id = ?'
    ).all(portfolio.id) as any[];

    const skills = {
      frontend: skillsRaw.filter(s => s.category === 'frontend').map(s => s.skill_name),
      backend: skillsRaw.filter(s => s.category === 'backend').map(s => s.skill_name),
      tools: skillsRaw.filter(s => s.category === 'tools').map(s => s.skill_name),
      other: skillsRaw.filter(s => s.category === 'other').map(s => s.skill_name),
    };

    const socialLinks = db.prepare(
      'SELECT * FROM social_links WHERE portfolio_id = ? ORDER BY sort_order'
    ).all(portfolio.id);

    const portfolioData = {
      personal: {
        name: portfolio.name || '',
        title: portfolio.title || '',
        location: portfolio.location || '',
        bio: portfolio.bio || '',
        photo: portfolio.photo || '',
        resumeUrl: portfolio.resume_url || '',
      },
      socialLinks: socialLinks.map((link: any) => ({
        name: link.name,
        icon: link.icon,
        url: link.url,
      })),
      navigation: [
        { label: 'home', href: '#home' },
        { label: 'projects', href: '#projects' },
        { label: 'blog', href: '#blog' },
        { label: 'contact', href: '#contact' },
      ],
      workExperience: workExperience.map((work: any) => ({
        id: work.id,
        period: work.period,
        position: work.position,
        company: work.company,
        location: work.location,
        description: work.description ? JSON.parse(work.description) : [],
        tags: work.tags ? JSON.parse(work.tags) : [],
      })),
      education: education.map((edu: any) => ({
        id: edu.id,
        period: edu.period,
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        description: edu.description ? JSON.parse(edu.description) : [],
      })),
      projects: projects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies ? JSON.parse(project.technologies) : [],
        image: project.image,
        liveUrl: project.live_url,
        githubUrl: project.github_url,
      })),
      skills,
    };

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
