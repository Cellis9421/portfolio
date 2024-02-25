export default interface IProject {
  color?: string;
  title: string;
  subtitle: string;
  description: string;
  viewLink?: string;
  codeLink?: string;
  iconElement?: React.ReactElement;
  tags?: string[];
}
