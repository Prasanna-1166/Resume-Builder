import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { Template01 } from './items/Template01';
import { Template02 } from './items/Template02';
import { Template03 } from './items/Template03';
import { Template04 } from './items/Template04';
import { Template05 } from './items/Template05';
import { Template06 } from './items/Template06';
import { Template07 } from './items/Template07';
import { Template08 } from './items/Template08';
import { Template09 } from './items/Template09';
import { Template10 } from './items/Template10';
import { Template11 } from './items/Template11';
import { Template12 } from './items/Template12';
import { Template13 } from './items/Template13';
import { Template14 } from './items/Template14';
import { Template15 } from './items/Template15';
import { Template17 } from './items/Template17';
import { Template18 } from './items/Template18';
import { Template19 } from './items/Template19';
import { Template20 } from './items/Template20';
import { Template21 } from './items/Template21';
import { Template23 } from './items/Template23';
import { Template24 } from './items/Template24';
import { Template25 } from './items/Template25';
import { TemplateExtra06 } from './items/TemplateExtra06';
import { TemplateExtra07 } from './items/TemplateExtra07';
import { TemplateExtra08 } from './items/TemplateExtra08';
import { TemplateExtra09 } from './items/TemplateExtra09';
import { TemplateExtra12 } from './items/TemplateExtra12';

export const TEMPLATE_REGISTRY: Record<string, React.FC<{ data: ResumeData; isPreview?: boolean }>> = {
  template_01: Template01,
  template_02: Template02,
  template_03: Template03,
  template_04: Template04,
  template_05: Template05,
  template_06: Template06,
  template_07: Template07,
  template_08: Template08,
  template_09: Template09,
  template_10: Template10,
  template_11: Template11,
  template_12: Template12,
  template_13: Template13,
  template_14: Template14,
  template_15: Template15,
  template_17: Template17,
  template_18: Template18,
  template_19: Template19,
  template_20: Template20,
  template_21: Template21,
  template_23: Template23,
  template_24: Template24,
  template_25: Template25,
  template_extra_06: TemplateExtra06,
  template_extra_07: TemplateExtra07,
  template_extra_08: TemplateExtra08,
  template_extra_09: TemplateExtra09,
  template_extra_12: TemplateExtra12,
};

export function getTemplateComponent(templateId: string): React.FC<{ data: ResumeData; isPreview?: boolean }> {
  return TEMPLATE_REGISTRY[templateId] || Template01;
}
