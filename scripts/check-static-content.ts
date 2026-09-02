import { checkStaticContent } from '../tools/perf/check-static-content';
import { exitFromResults, printResult } from '../tools/perf/lib/runner';

const result = checkStaticContent();
printResult(result);
exitFromResults([result]);
