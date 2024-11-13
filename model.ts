
interface PwdTransKey {
  X: string;
  Y: string;
}
interface IArea {
  Code: string;
  Name: string;
}
export interface Dept {
  Code: string;
  Name: string;
  Level: number;
}
export interface IElement {
  Name: string;
  Label: string;
  LabelEN: string;
  Category: string;
  CategoryEN: string;
  Icon: string;
  Color: string;
  Controller: string;
  Bill: boolean;   //Controller是否是bill
  ProjectModule: boolean;   //是否是项目模块，前端根据该标志生成prjmodule、project-bill的url
  Dept: string; //前端没有使用，目前仅role修改中用到
  HasHelp: boolean;   //是否有帮助信息
  // BillOperate string //如果是bill，则存放add\edit\delete\browse之一
  URL: string;
  SignStr: string;
  NotMenu: boolean;
}

interface ColumnType {
  Name: string;
  Type: string;
}
interface RecordViewFetchDataRenderRow {
  RowNum: number;
  Checked: boolean;   //是否被选中
  Key: string; //该行关联的主键值，多字段用csv格式组合
  Data: Record<string, any>;
  Processes: Record<string, RenderProcess>; //该行对应的处理按钮，true为能操作
}
interface RenderProcess {
  URL: string; //对应的url，包括query部分
  Sign: string; //对应url的签名
  Enabled: boolean;   //是否能操作
}
interface RecordViewFetchDataResultData {
  Title: string; //V3 后加的，用于存放从query中解密的title值
  Rows: RecordViewFetchDataRenderRow[];
  Columns: ColumnType[];
  DisplayColumns: ColumnType[];
  RowCount: number;                    //一般为-1，除非最后一页，通过最后的序号得出总数
  DownRowNum: number;                    //下一页用到的起始序号
  DownDivide: string[];                 //下一页用到的起始分界值
  Processes: Record<string, RenderProcess>; //不挂接记录的处理按钮，true为可操作
  AliasNames: Record<string, string>;
}
interface RecordViewFetchDataResult {
  Error: string;
  FData: RecordViewFetchDataResultData;
  TimeConsuming: number;
}

interface LabelKey {
  CategoryID: string;
  ID: string;
}
interface ElementColumnsDigest {
  OwnerBy: string;
  Owner: string;
  Name: string;
}
interface ConditionalValue {
  Type: string;
  Field: string;
  Value: string;
}

interface RecordViewFetchDataParam {
  Divide?: string[];//分隔行的主键值
  Order?: string[];//排序的字段
  Field?: string;//字段
  Opt?: string;//运算符
  Value?: string;//值
  SelType?: string;//选择类型
  SelKeys?: string[];//选择的主键
  Limit: number;//每页最多行数
  DivideRowNum: number;//开始行号
  Labels?: LabelKey[]//应用的标签ID
  LabelLogic?: string;//交集或者并集
  View?: ElementColumnsDigest;//显示列的模板
  ConditionalTemplate?: ConditionalValue;//条件模板的设置参数
  WithSQL?: boolean;//是否返回sql语句
  ConditionLines?: ConditionLine[];               //多条件查询
}

interface ConditionLine {
  LeftBrackets?: string;
  ColumnName: string;
  Operator: string;
  Value: string;
  RightBrackets?: string;
  Logic?: string;
}