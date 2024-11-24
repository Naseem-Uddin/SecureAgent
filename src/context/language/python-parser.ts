import { AbstractParser, EnclosingContext, PRFile, PRSuggestion } from "../../constants";
import { execSync } from "child_process";

export class PythonParser implements AbstractParser {
  findEnclosingContext(
    file: string,
    lineStart: number,
    lineEnd: number
  ): EnclosingContext {
    try {
      const pythonScriptPath = "path/to/python_parser.py";
      const result = execSync(
        `python3 ${pythonScriptPath} ${file} ${lineStart} ${lineEnd}`,
        { encoding: "utf-8" }
      );
      const context = JSON.parse(result);
      return {
        enclosingContext: context,
      } as EnclosingContext;
    } catch (error) {
      console.error("Error while finding enclosing context:", error);
      return {
        enclosingContext: null,
      } as EnclosingContext;
    }
  }

  dryRun(file: string): { valid: boolean; error: string } {
    try {
      const pythonScriptPath = "path/to/python_parser.py";
      execSync(`python3 ${pythonScriptPath} ${file} 0 0`, {
        encoding: "utf-8",
      });
      return {
        valid: true,
        error: "",
      };
    } catch (exc) {
      return {
        valid: false,
        error: exc.toString(),
      };
    }
  }

  reviewPullRequest(files: PRFile[]): PRSuggestion[] {
    try {
      const pythonScriptPath = "path/to/python_review.py";
      const filesJson = JSON.stringify(files);
      
      // Write files data to temp file to avoid command line length limits
      const tempFile = "/tmp/pr_files.json";
      require('fs').writeFileSync(tempFile, filesJson);

      const result = execSync(
        `python3 ${pythonScriptPath} ${tempFile}`,
        { encoding: "utf-8" }
      );

      const suggestions = JSON.parse(result) as PRSuggestion[];
      return suggestions;

    } catch (error) {
      console.error("Error while reviewing Python files:", error);
      return [];
    }
  }
}
