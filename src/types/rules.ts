export type AccentColor = 'red' | 'yellow' | 'green' | 'blue';

export type RuleOption = {
  id: string;
  text: string;
  isUserAdded?: boolean;
};

export type RuleCategory = {
  id: string;
  heading: string;
  exclusive: boolean;
  accentColor: AccentColor;
  options: RuleOption[];
};

export type RuleLibrary = {
  categories: RuleCategory[];
};

export type PresetId = 'official' | 'nejas';

export type Preset = {
  id: PresetId;
  name: string;
  selectedIds: string[];
};

export type PresetsFile = Record<PresetId, Preset>;

export type CustomState = {
  title: string;
  selectedIds: string[];
  customOptions: Record<string, RuleOption[]>;
};

export type SetupSection = {
  id: string;
  heading: string;
  items: string[];
};

export type SetupContent = {
  title: string;
  sections: SetupSection[];
};
