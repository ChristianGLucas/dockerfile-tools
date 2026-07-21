// package: christiangeorgelucas.dockerfile_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class DockerfileInput extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DockerfileInput.AsObject;
  static toObject(includeInstance: boolean, msg: DockerfileInput): DockerfileInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DockerfileInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DockerfileInput;
  static deserializeBinaryFromReader(message: DockerfileInput, reader: jspb.BinaryReader): DockerfileInput;
}

export namespace DockerfileInput {
  export type AsObject = {
    content: string,
  }
}

export class Issue extends jspb.Message {
  getLine(): number;
  setLine(value: number): void;

  getColumn(): number;
  setColumn(value: number): void;

  getSeverity(): string;
  setSeverity(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Issue.AsObject;
  static toObject(includeInstance: boolean, msg: Issue): Issue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Issue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Issue;
  static deserializeBinaryFromReader(message: Issue, reader: jspb.BinaryReader): Issue;
}

export namespace Issue {
  export type AsObject = {
    line: number,
    column: number,
    severity: string,
    message: string,
  }
}

export class Instruction extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): void;

  getArguments(): string;
  setArguments(value: string): void;

  clearArgumentListList(): void;
  getArgumentListList(): Array<string>;
  setArgumentListList(value: Array<string>): void;
  addArgumentList(value: string, index?: number): string;

  getRaw(): string;
  setRaw(value: string): void;

  getStartLine(): number;
  setStartLine(value: number): void;

  getEndLine(): number;
  setEndLine(value: number): void;

  getStageIndex(): number;
  setStageIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Instruction.AsObject;
  static toObject(includeInstance: boolean, msg: Instruction): Instruction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Instruction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Instruction;
  static deserializeBinaryFromReader(message: Instruction, reader: jspb.BinaryReader): Instruction;
}

export namespace Instruction {
  export type AsObject = {
    keyword: string,
    arguments: string,
    argumentListList: Array<string>,
    raw: string,
    startLine: number,
    endLine: number,
    stageIndex: number,
  }
}

export class Comment extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Comment.AsObject;
  static toObject(includeInstance: boolean, msg: Comment): Comment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Comment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Comment;
  static deserializeBinaryFromReader(message: Comment, reader: jspb.BinaryReader): Comment;
}

export namespace Comment {
  export type AsObject = {
    text: string,
    line: number,
  }
}

export class ParserDirective extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParserDirective.AsObject;
  static toObject(includeInstance: boolean, msg: ParserDirective): ParserDirective.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParserDirective, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParserDirective;
  static deserializeBinaryFromReader(message: ParserDirective, reader: jspb.BinaryReader): ParserDirective;
}

export namespace ParserDirective {
  export type AsObject = {
    name: string,
    value: string,
    line: number,
  }
}

export class ParsedDockerfile extends jspb.Message {
  clearInstructionsList(): void;
  getInstructionsList(): Array<Instruction>;
  setInstructionsList(value: Array<Instruction>): void;
  addInstructions(value?: Instruction, index?: number): Instruction;

  clearCommentsList(): void;
  getCommentsList(): Array<Comment>;
  setCommentsList(value: Array<Comment>): void;
  addComments(value?: Comment, index?: number): Comment;

  clearDirectivesList(): void;
  getDirectivesList(): Array<ParserDirective>;
  setDirectivesList(value: Array<ParserDirective>): void;
  addDirectives(value?: ParserDirective, index?: number): ParserDirective;

  getEscapeCharacter(): string;
  setEscapeCharacter(value: string): void;

  clearIssuesList(): void;
  getIssuesList(): Array<Issue>;
  setIssuesList(value: Array<Issue>): void;
  addIssues(value?: Issue, index?: number): Issue;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParsedDockerfile.AsObject;
  static toObject(includeInstance: boolean, msg: ParsedDockerfile): ParsedDockerfile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParsedDockerfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParsedDockerfile;
  static deserializeBinaryFromReader(message: ParsedDockerfile, reader: jspb.BinaryReader): ParsedDockerfile;
}

export namespace ParsedDockerfile {
  export type AsObject = {
    instructionsList: Array<Instruction.AsObject>,
    commentsList: Array<Comment.AsObject>,
    directivesList: Array<ParserDirective.AsObject>,
    escapeCharacter: string,
    issuesList: Array<Issue.AsObject>,
    error: string,
  }
}

export class ListInstructionsByTypeInput extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  getKeyword(): string;
  setKeyword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListInstructionsByTypeInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListInstructionsByTypeInput): ListInstructionsByTypeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListInstructionsByTypeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListInstructionsByTypeInput;
  static deserializeBinaryFromReader(message: ListInstructionsByTypeInput, reader: jspb.BinaryReader): ListInstructionsByTypeInput;
}

export namespace ListInstructionsByTypeInput {
  export type AsObject = {
    content: string,
    keyword: string,
  }
}

export class InstructionList extends jspb.Message {
  clearInstructionsList(): void;
  getInstructionsList(): Array<Instruction>;
  setInstructionsList(value: Array<Instruction>): void;
  addInstructions(value?: Instruction, index?: number): Instruction;

  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstructionList.AsObject;
  static toObject(includeInstance: boolean, msg: InstructionList): InstructionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstructionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstructionList;
  static deserializeBinaryFromReader(message: InstructionList, reader: jspb.BinaryReader): InstructionList;
}

export namespace InstructionList {
  export type AsObject = {
    instructionsList: Array<Instruction.AsObject>,
    count: number,
    error: string,
  }
}

export class BaseImage extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getRepository(): string;
  setRepository(value: string): void;

  getTag(): string;
  setTag(value: string): void;

  getDigest(): string;
  setDigest(value: string): void;

  getPlatform(): string;
  setPlatform(value: string): void;

  getStageAlias(): string;
  setStageAlias(value: string): void;

  getStageIndex(): number;
  setStageIndex(value: number): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseImage.AsObject;
  static toObject(includeInstance: boolean, msg: BaseImage): BaseImage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BaseImage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseImage;
  static deserializeBinaryFromReader(message: BaseImage, reader: jspb.BinaryReader): BaseImage;
}

export namespace BaseImage {
  export type AsObject = {
    raw: string,
    repository: string,
    tag: string,
    digest: string,
    platform: string,
    stageAlias: string,
    stageIndex: number,
    line: number,
  }
}

export class BaseImageList extends jspb.Message {
  clearImagesList(): void;
  getImagesList(): Array<BaseImage>;
  setImagesList(value: Array<BaseImage>): void;
  addImages(value?: BaseImage, index?: number): BaseImage;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseImageList.AsObject;
  static toObject(includeInstance: boolean, msg: BaseImageList): BaseImageList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BaseImageList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseImageList;
  static deserializeBinaryFromReader(message: BaseImageList, reader: jspb.BinaryReader): BaseImageList;
}

export namespace BaseImageList {
  export type AsObject = {
    imagesList: Array<BaseImage.AsObject>,
    error: string,
  }
}

export class Stage extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getName(): string;
  setName(value: string): void;

  getBaseImage(): string;
  setBaseImage(value: string): void;

  getBaseIsStageRef(): boolean;
  setBaseIsStageRef(value: boolean): void;

  getBaseStageIndex(): number;
  setBaseStageIndex(value: number): void;

  getPlatform(): string;
  setPlatform(value: string): void;

  getFromLine(): number;
  setFromLine(value: number): void;

  getInstructionCount(): number;
  setInstructionCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Stage.AsObject;
  static toObject(includeInstance: boolean, msg: Stage): Stage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Stage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Stage;
  static deserializeBinaryFromReader(message: Stage, reader: jspb.BinaryReader): Stage;
}

export namespace Stage {
  export type AsObject = {
    index: number,
    name: string,
    baseImage: string,
    baseIsStageRef: boolean,
    baseStageIndex: number,
    platform: string,
    fromLine: number,
    instructionCount: number,
  }
}

export class StageList extends jspb.Message {
  clearStagesList(): void;
  getStagesList(): Array<Stage>;
  setStagesList(value: Array<Stage>): void;
  addStages(value?: Stage, index?: number): Stage;

  getIsMultiStage(): boolean;
  setIsMultiStage(value: boolean): void;

  getStageCount(): number;
  setStageCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StageList.AsObject;
  static toObject(includeInstance: boolean, msg: StageList): StageList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StageList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StageList;
  static deserializeBinaryFromReader(message: StageList, reader: jspb.BinaryReader): StageList;
}

export namespace StageList {
  export type AsObject = {
    stagesList: Array<Stage.AsObject>,
    isMultiStage: boolean,
    stageCount: number,
    error: string,
  }
}

export class Port extends jspb.Message {
  getPort(): number;
  setPort(value: number): void;

  getProtocol(): string;
  setProtocol(value: string): void;

  getRaw(): string;
  setRaw(value: string): void;

  getResolved(): boolean;
  setResolved(value: boolean): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Port.AsObject;
  static toObject(includeInstance: boolean, msg: Port): Port.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Port, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Port;
  static deserializeBinaryFromReader(message: Port, reader: jspb.BinaryReader): Port;
}

export namespace Port {
  export type AsObject = {
    port: number,
    protocol: string,
    raw: string,
    resolved: boolean,
    line: number,
  }
}

export class PortList extends jspb.Message {
  clearPortsList(): void;
  getPortsList(): Array<Port>;
  setPortsList(value: Array<Port>): void;
  addPorts(value?: Port, index?: number): Port;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PortList.AsObject;
  static toObject(includeInstance: boolean, msg: PortList): PortList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PortList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PortList;
  static deserializeBinaryFromReader(message: PortList, reader: jspb.BinaryReader): PortList;
}

export namespace PortList {
  export type AsObject = {
    portsList: Array<Port.AsObject>,
    error: string,
  }
}

export class EnvVar extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvVar.AsObject;
  static toObject(includeInstance: boolean, msg: EnvVar): EnvVar.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvVar, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvVar;
  static deserializeBinaryFromReader(message: EnvVar, reader: jspb.BinaryReader): EnvVar;
}

export namespace EnvVar {
  export type AsObject = {
    key: string,
    value: string,
    line: number,
  }
}

export class EnvVarList extends jspb.Message {
  clearVarsList(): void;
  getVarsList(): Array<EnvVar>;
  setVarsList(value: Array<EnvVar>): void;
  addVars(value?: EnvVar, index?: number): EnvVar;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvVarList.AsObject;
  static toObject(includeInstance: boolean, msg: EnvVarList): EnvVarList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvVarList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvVarList;
  static deserializeBinaryFromReader(message: EnvVarList, reader: jspb.BinaryReader): EnvVarList;
}

export namespace EnvVarList {
  export type AsObject = {
    varsList: Array<EnvVar.AsObject>,
    error: string,
  }
}

export class Arg extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDefaultValue(): string;
  setDefaultValue(value: string): void;

  getHasDefault(): boolean;
  setHasDefault(value: boolean): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Arg.AsObject;
  static toObject(includeInstance: boolean, msg: Arg): Arg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Arg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Arg;
  static deserializeBinaryFromReader(message: Arg, reader: jspb.BinaryReader): Arg;
}

export namespace Arg {
  export type AsObject = {
    name: string,
    defaultValue: string,
    hasDefault: boolean,
    line: number,
  }
}

export class ArgList extends jspb.Message {
  clearArgsList(): void;
  getArgsList(): Array<Arg>;
  setArgsList(value: Array<Arg>): void;
  addArgs(value?: Arg, index?: number): Arg;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArgList.AsObject;
  static toObject(includeInstance: boolean, msg: ArgList): ArgList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ArgList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArgList;
  static deserializeBinaryFromReader(message: ArgList, reader: jspb.BinaryReader): ArgList;
}

export namespace ArgList {
  export type AsObject = {
    argsList: Array<Arg.AsObject>,
    error: string,
  }
}

export class CopyInstruction extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): void;

  clearSourcesList(): void;
  getSourcesList(): Array<string>;
  setSourcesList(value: Array<string>): void;
  addSources(value: string, index?: number): string;

  getDestination(): string;
  setDestination(value: string): void;

  getFromStage(): string;
  setFromStage(value: string): void;

  getChown(): string;
  setChown(value: string): void;

  getChmod(): string;
  setChmod(value: string): void;

  getLink(): boolean;
  setLink(value: boolean): void;

  getRaw(): string;
  setRaw(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyInstruction.AsObject;
  static toObject(includeInstance: boolean, msg: CopyInstruction): CopyInstruction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyInstruction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyInstruction;
  static deserializeBinaryFromReader(message: CopyInstruction, reader: jspb.BinaryReader): CopyInstruction;
}

export namespace CopyInstruction {
  export type AsObject = {
    keyword: string,
    sourcesList: Array<string>,
    destination: string,
    fromStage: string,
    chown: string,
    chmod: string,
    link: boolean,
    raw: string,
    line: number,
  }
}

export class CopyInstructionList extends jspb.Message {
  clearInstructionsList(): void;
  getInstructionsList(): Array<CopyInstruction>;
  setInstructionsList(value: Array<CopyInstruction>): void;
  addInstructions(value?: CopyInstruction, index?: number): CopyInstruction;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyInstructionList.AsObject;
  static toObject(includeInstance: boolean, msg: CopyInstructionList): CopyInstructionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyInstructionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyInstructionList;
  static deserializeBinaryFromReader(message: CopyInstructionList, reader: jspb.BinaryReader): CopyInstructionList;
}

export namespace CopyInstructionList {
  export type AsObject = {
    instructionsList: Array<CopyInstruction.AsObject>,
    error: string,
  }
}

export class EntrypointCmd extends jspb.Message {
  getHasCmd(): boolean;
  setHasCmd(value: boolean): void;

  getCmdExecForm(): boolean;
  setCmdExecForm(value: boolean): void;

  clearCmdArgsList(): void;
  getCmdArgsList(): Array<string>;
  setCmdArgsList(value: Array<string>): void;
  addCmdArgs(value: string, index?: number): string;

  getCmdShellString(): string;
  setCmdShellString(value: string): void;

  getCmdLine(): number;
  setCmdLine(value: number): void;

  getHasEntrypoint(): boolean;
  setHasEntrypoint(value: boolean): void;

  getEntrypointExecForm(): boolean;
  setEntrypointExecForm(value: boolean): void;

  clearEntrypointArgsList(): void;
  getEntrypointArgsList(): Array<string>;
  setEntrypointArgsList(value: Array<string>): void;
  addEntrypointArgs(value: string, index?: number): string;

  getEntrypointShellString(): string;
  setEntrypointShellString(value: string): void;

  getEntrypointLine(): number;
  setEntrypointLine(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntrypointCmd.AsObject;
  static toObject(includeInstance: boolean, msg: EntrypointCmd): EntrypointCmd.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EntrypointCmd, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EntrypointCmd;
  static deserializeBinaryFromReader(message: EntrypointCmd, reader: jspb.BinaryReader): EntrypointCmd;
}

export namespace EntrypointCmd {
  export type AsObject = {
    hasCmd: boolean,
    cmdExecForm: boolean,
    cmdArgsList: Array<string>,
    cmdShellString: string,
    cmdLine: number,
    hasEntrypoint: boolean,
    entrypointExecForm: boolean,
    entrypointArgsList: Array<string>,
    entrypointShellString: string,
    entrypointLine: number,
    error: string,
  }
}

export class Label extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Label.AsObject;
  static toObject(includeInstance: boolean, msg: Label): Label.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Label, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Label;
  static deserializeBinaryFromReader(message: Label, reader: jspb.BinaryReader): Label;
}

export namespace Label {
  export type AsObject = {
    key: string,
    value: string,
    line: number,
  }
}

export class LabelList extends jspb.Message {
  clearLabelsList(): void;
  getLabelsList(): Array<Label>;
  setLabelsList(value: Array<Label>): void;
  addLabels(value?: Label, index?: number): Label;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LabelList.AsObject;
  static toObject(includeInstance: boolean, msg: LabelList): LabelList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LabelList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LabelList;
  static deserializeBinaryFromReader(message: LabelList, reader: jspb.BinaryReader): LabelList;
}

export namespace LabelList {
  export type AsObject = {
    labelsList: Array<Label.AsObject>,
    error: string,
  }
}

export class VolumeDecl extends jspb.Message {
  clearPathsList(): void;
  getPathsList(): Array<string>;
  setPathsList(value: Array<string>): void;
  addPaths(value: string, index?: number): string;

  getRaw(): string;
  setRaw(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumeDecl.AsObject;
  static toObject(includeInstance: boolean, msg: VolumeDecl): VolumeDecl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VolumeDecl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumeDecl;
  static deserializeBinaryFromReader(message: VolumeDecl, reader: jspb.BinaryReader): VolumeDecl;
}

export namespace VolumeDecl {
  export type AsObject = {
    pathsList: Array<string>,
    raw: string,
    line: number,
  }
}

export class VolumeList extends jspb.Message {
  clearVolumesList(): void;
  getVolumesList(): Array<VolumeDecl>;
  setVolumesList(value: Array<VolumeDecl>): void;
  addVolumes(value?: VolumeDecl, index?: number): VolumeDecl;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumeList.AsObject;
  static toObject(includeInstance: boolean, msg: VolumeList): VolumeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VolumeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumeList;
  static deserializeBinaryFromReader(message: VolumeList, reader: jspb.BinaryReader): VolumeList;
}

export namespace VolumeList {
  export type AsObject = {
    volumesList: Array<VolumeDecl.AsObject>,
    error: string,
  }
}

export class Workdir extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Workdir.AsObject;
  static toObject(includeInstance: boolean, msg: Workdir): Workdir.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Workdir, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Workdir;
  static deserializeBinaryFromReader(message: Workdir, reader: jspb.BinaryReader): Workdir;
}

export namespace Workdir {
  export type AsObject = {
    path: string,
    line: number,
  }
}

export class WorkdirList extends jspb.Message {
  clearWorkdirsList(): void;
  getWorkdirsList(): Array<Workdir>;
  setWorkdirsList(value: Array<Workdir>): void;
  addWorkdirs(value?: Workdir, index?: number): Workdir;

  getFinalWorkdir(): string;
  setFinalWorkdir(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkdirList.AsObject;
  static toObject(includeInstance: boolean, msg: WorkdirList): WorkdirList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkdirList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkdirList;
  static deserializeBinaryFromReader(message: WorkdirList, reader: jspb.BinaryReader): WorkdirList;
}

export namespace WorkdirList {
  export type AsObject = {
    workdirsList: Array<Workdir.AsObject>,
    finalWorkdir: string,
    error: string,
  }
}

export class UserDecl extends jspb.Message {
  getUser(): string;
  setUser(value: string): void;

  getGroup(): string;
  setGroup(value: string): void;

  getRaw(): string;
  setRaw(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserDecl.AsObject;
  static toObject(includeInstance: boolean, msg: UserDecl): UserDecl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserDecl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserDecl;
  static deserializeBinaryFromReader(message: UserDecl, reader: jspb.BinaryReader): UserDecl;
}

export namespace UserDecl {
  export type AsObject = {
    user: string,
    group: string,
    raw: string,
    line: number,
  }
}

export class UserList extends jspb.Message {
  clearUsersList(): void;
  getUsersList(): Array<UserDecl>;
  setUsersList(value: Array<UserDecl>): void;
  addUsers(value?: UserDecl, index?: number): UserDecl;

  getFinalUser(): string;
  setFinalUser(value: string): void;

  getFinalGroup(): string;
  setFinalGroup(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserList.AsObject;
  static toObject(includeInstance: boolean, msg: UserList): UserList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserList;
  static deserializeBinaryFromReader(message: UserList, reader: jspb.BinaryReader): UserList;
}

export namespace UserList {
  export type AsObject = {
    usersList: Array<UserDecl.AsObject>,
    finalUser: string,
    finalGroup: string,
    error: string,
  }
}

export class HealthcheckInfo extends jspb.Message {
  getPresent(): boolean;
  setPresent(value: boolean): void;

  getIsNone(): boolean;
  setIsNone(value: boolean): void;

  getTestType(): string;
  setTestType(value: string): void;

  clearCommandList(): void;
  getCommandList(): Array<string>;
  setCommandList(value: Array<string>): void;
  addCommand(value: string, index?: number): string;

  getInterval(): string;
  setInterval(value: string): void;

  getTimeout(): string;
  setTimeout(value: string): void;

  getStartPeriod(): string;
  setStartPeriod(value: string): void;

  getRetries(): string;
  setRetries(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthcheckInfo.AsObject;
  static toObject(includeInstance: boolean, msg: HealthcheckInfo): HealthcheckInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HealthcheckInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthcheckInfo;
  static deserializeBinaryFromReader(message: HealthcheckInfo, reader: jspb.BinaryReader): HealthcheckInfo;
}

export namespace HealthcheckInfo {
  export type AsObject = {
    present: boolean,
    isNone: boolean,
    testType: string,
    commandList: Array<string>,
    interval: string,
    timeout: string,
    startPeriod: string,
    retries: string,
    line: number,
    error: string,
  }
}

export class ResolveStageBaseImageInput extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  getStage(): string;
  setStage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveStageBaseImageInput.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveStageBaseImageInput): ResolveStageBaseImageInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveStageBaseImageInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveStageBaseImageInput;
  static deserializeBinaryFromReader(message: ResolveStageBaseImageInput, reader: jspb.BinaryReader): ResolveStageBaseImageInput;
}

export namespace ResolveStageBaseImageInput {
  export type AsObject = {
    content: string,
    stage: string,
  }
}

export class ResolvedBaseImage extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getResolvedImage(): string;
  setResolvedImage(value: string): void;

  clearResolutionChainList(): void;
  getResolutionChainList(): Array<string>;
  setResolutionChainList(value: Array<string>): void;
  addResolutionChain(value: string, index?: number): string;

  getIsExternal(): boolean;
  setIsExternal(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolvedBaseImage.AsObject;
  static toObject(includeInstance: boolean, msg: ResolvedBaseImage): ResolvedBaseImage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolvedBaseImage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolvedBaseImage;
  static deserializeBinaryFromReader(message: ResolvedBaseImage, reader: jspb.BinaryReader): ResolvedBaseImage;
}

export namespace ResolvedBaseImage {
  export type AsObject = {
    found: boolean,
    resolvedImage: string,
    resolutionChainList: Array<string>,
    isExternal: boolean,
    error: string,
  }
}

export class InstructionCount extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstructionCount.AsObject;
  static toObject(includeInstance: boolean, msg: InstructionCount): InstructionCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstructionCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstructionCount;
  static deserializeBinaryFromReader(message: InstructionCount, reader: jspb.BinaryReader): InstructionCount;
}

export namespace InstructionCount {
  export type AsObject = {
    keyword: string,
    count: number,
  }
}

export class DockerfileSummary extends jspb.Message {
  getTotalInstructions(): number;
  setTotalInstructions(value: number): void;

  getLineCount(): number;
  setLineCount(value: number): void;

  getStageCount(): number;
  setStageCount(value: number): void;

  getIsMultiStage(): boolean;
  setIsMultiStage(value: boolean): void;

  clearInstructionCountsList(): void;
  getInstructionCountsList(): Array<InstructionCount>;
  setInstructionCountsList(value: Array<InstructionCount>): void;
  addInstructionCounts(value?: InstructionCount, index?: number): InstructionCount;

  getHasHealthcheck(): boolean;
  setHasHealthcheck(value: boolean): void;

  getExposedPortCount(): number;
  setExposedPortCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DockerfileSummary.AsObject;
  static toObject(includeInstance: boolean, msg: DockerfileSummary): DockerfileSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DockerfileSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DockerfileSummary;
  static deserializeBinaryFromReader(message: DockerfileSummary, reader: jspb.BinaryReader): DockerfileSummary;
}

export namespace DockerfileSummary {
  export type AsObject = {
    totalInstructions: number,
    lineCount: number,
    stageCount: number,
    isMultiStage: boolean,
    instructionCountsList: Array<InstructionCount.AsObject>,
    hasHealthcheck: boolean,
    exposedPortCount: number,
    error: string,
  }
}

export class ValidationResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<Issue>;
  setIssuesList(value: Array<Issue>): void;
  addIssues(value?: Issue, index?: number): Issue;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationResult): ValidationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationResult;
  static deserializeBinaryFromReader(message: ValidationResult, reader: jspb.BinaryReader): ValidationResult;
}

export namespace ValidationResult {
  export type AsObject = {
    valid: boolean,
    issuesList: Array<Issue.AsObject>,
    error: string,
  }
}

