import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer
} from 'docx';
import { ResumeData } from './types.js';

export async function generateDocxBlob(data: ResumeData): Promise<Buffer> {
  const children: any[] = [];

  // Helper for Section Heading
  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: '333333',
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: '1E293B',
          font: 'Arial'
        })
      ]
    });
  };

  // 1. Header (Name, Title, Contact)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: data.personalInfo.fullName || 'Untitled Candidate',
          bold: true,
          size: 36, // 18pt
          font: 'Arial',
          color: '0F172A'
        })
      ]
    })
  );

  if (data.personalInfo.professionalTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: data.personalInfo.professionalTitle,
            italics: true,
            size: 22,
            font: 'Arial',
            color: '475569'
          })
        ]
      })
    );
  }

  // Contact line
  const contactParts: string[] = [];
  if (data.personalInfo.email) contactParts.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactParts.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactParts.push(data.personalInfo.location);
  if (data.personalInfo.linkedin) contactParts.push(data.personalInfo.linkedin);
  if (data.personalInfo.github) contactParts.push(data.personalInfo.github);
  if (data.personalInfo.website) contactParts.push(data.personalInfo.website);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18,
            font: 'Arial',
            color: '334155'
          })
        ]
      })
    );
  }

  // 2. Summary
  if (data.sectionVisibility?.summary !== false && data.summary) {
    children.push(createSectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: data.summary,
            size: 20,
            font: 'Arial',
            color: '1E293B'
          })
        ]
      })
    );
  }

  // 3. Education
  if (data.sectionVisibility?.education !== false && data.education && data.education.length > 0) {
    children.push(createSectionHeading('Education'));
    data.education.forEach(edu => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 20,
              font: 'Arial'
            }),
            new TextRun({
              text: edu.location ? ` — ${edu.location}` : '',
              size: 20,
              font: 'Arial',
              color: '475569'
            }),
            new TextRun({
              text: `\t${edu.startDate} – ${edu.endDate || 'Present'}`,
              bold: true,
              size: 18,
              font: 'Arial',
              color: '334155'
            })
          ]
        })
      );

      const degreeLine = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpaOrGrade ? ` | GPA/Grade: ${edu.gpaOrGrade}` : ''}`;
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: degreeLine,
              italics: true,
              size: 19,
              font: 'Arial',
              color: '334155'
            })
          ]
        })
      );

      if (edu.coursework && edu.coursework.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Relevant Coursework: ${edu.coursework.join(', ')}`,
                size: 18,
                font: 'Arial',
                color: '475569'
              })
            ]
          })
        );
      }
    });
  }

  // 4. Experience
  if (data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) {
    children.push(createSectionHeading('Experience'));
    data.experience.forEach(exp => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 20,
              font: 'Arial'
            }),
            new TextRun({
              text: ` | ${exp.company}${exp.location ? `, ${exp.location}` : ''}`,
              size: 20,
              font: 'Arial',
              color: '1E293B'
            }),
            new TextRun({
              text: `\t${exp.startDate} – ${exp.endDate || 'Present'}`,
              size: 18,
              font: 'Arial',
              color: '475569'
            })
          ]
        })
      );

      if (exp.departmentOrTeam) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: exp.departmentOrTeam,
                italics: true,
                size: 18,
                font: 'Arial',
                color: '64748B'
              })
            ]
          })
        );
      }

      exp.bullets?.forEach(b => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: b,
                size: 19,
                font: 'Arial',
                color: '1E293B'
              })
            ]
          })
        );
      });
    });
  }

  // 5. Projects
  if (data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) {
    children.push(createSectionHeading('Projects'));
    data.projects.forEach(proj => {
      const techList = Array.isArray(proj.technologies) ? proj.technologies : [];
      const techStr = techList.length > 0 ? ` [${techList.join(', ')}]` : '';
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: proj.name || 'Project',
              bold: true,
              size: 20,
              font: 'Arial'
            }),
            new TextRun({
              text: techStr,
              italics: true,
              size: 18,
              font: 'Arial',
              color: '475569'
            }),
            new TextRun({
              text: proj.url || proj.repoUrl ? `\t${proj.url || proj.repoUrl}` : '',
              size: 17,
              font: 'Arial',
              color: '2563EB'
            })
          ]
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: proj.description,
                size: 18,
                font: 'Arial',
                color: '334155'
              })
            ]
          })
        );
      }

      proj.bullets?.forEach(b => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: b,
                size: 19,
                font: 'Arial',
                color: '1E293B'
              })
            ]
          })
        );
      });
    });
  }

  // 6. Skills
  if (data.sectionVisibility?.skills !== false && data.skills && data.skills.length > 0) {
    children.push(createSectionHeading('Technical & Domain Skills'));
    data.skills.forEach((skill: any) => {
      if (typeof skill === 'string') {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: skill,
                size: 19,
                font: 'Arial',
                color: '334155'
              })
            ]
          })
        );
      } else if (skill && typeof skill === 'object') {
        const catName = skill.category ? `${skill.category}: ` : '';
        const itemsArr = Array.isArray(skill.items) ? skill.items : (skill.name ? [skill.name] : []);
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              ...(catName ? [new TextRun({
                text: catName,
                bold: true,
                size: 19,
                font: 'Arial',
                color: '0F172A'
              })] : []),
              new TextRun({
                text: itemsArr.join(', '),
                size: 19,
                font: 'Arial',
                color: '334155'
              })
            ]
          })
        );
      }
    });
  }

  // 7. Certifications
  if (data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) {
    children.push(createSectionHeading('Certifications'));
    data.certifications.forEach(cert => {
      children.push(
        new Paragraph({
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 19,
              font: 'Arial'
            }),
            new TextRun({
              text: ` — ${cert.issuer} (${cert.date})`,
              size: 19,
              font: 'Arial',
              color: '475569'
            })
          ]
        })
      );
    });
  }

  // 8. Achievements
  if (data.sectionVisibility?.achievements !== false && data.achievements && data.achievements.length > 0) {
    children.push(createSectionHeading('Honors & Achievements'));
    data.achievements.forEach(ach => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: `${ach.title}: `,
              bold: true,
              size: 19,
              font: 'Arial'
            }),
            new TextRun({
              text: ach.description,
              size: 19,
              font: 'Arial',
              color: '334155'
            })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
