export interface FurtherReading {
  label: string;
  url: string;
}

export interface CommandEntry {
  id: string;
  tool: string;
  category: string;
  scenario_tags: string[];
  platform: 'linux' | 'windows' | 'cross-platform';
  title: string;
  command: string;
  description: string;
  when_to_use: string;
  example: string;
  common_pitfalls?: string;
  related_ids?: string[];
  further_reading?: FurtherReading[];
  flag_descriptions?: Record<string, string>;
  optional_flags?: Array<{ flag: string; description: string }>;
}

export interface ModuleEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}
