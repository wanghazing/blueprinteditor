export class HttpLogResolver {
  private name: string = "http-log-resolver";
  private maxSize: number = 5 * 1024 * 1024;
  private imme: string[] = ["application/json"];
  resolve(file: File): Promise<{
    title: string;
    rows: { rule: string; data: any }[];
  }> {
    return new Promise((res, rej) => {
      const { type, size } = file;
      if (this.imme.indexOf(type) === -1) {
        return rej(`${this.name}解析失败：文件类型错误`);
      }
      if (this.maxSize < size) {
        return rej(`${this.name}解析失败：文件过大`);
      }
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e2) => {
        // base64Str.value = e2?.target?.result;
        try {
          const dataStr = e2.target?.result || "{}";
          const data = JSON.parse(dataStr.toString());
          if (!data.type || data.type !== "qdz-http-log") {
            return rej(`${this.name}解析失败：日志类型错误`);
          }
          return res({
            title: file.name,
            rows: [
              { rule: "headers", data: data.response.headers },
              { rule: "body", data: data.response.body },
              { rule: "body-buffer", data: data.response.bodyBuffer },
            ],
          });
        } catch (error) {
          rej(`${this.name}解析失败：${error}`);
        }
      };
      reader.onerror = (err) => {
        rej(`${this.name}解析失败：${err}`);
      };
    });
  }
}
