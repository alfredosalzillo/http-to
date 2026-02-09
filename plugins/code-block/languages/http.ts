import { StreamLanguage } from "@codemirror/language";
import { http as streamHttp } from "@codemirror/legacy-modes/mode/http";

const http = () => StreamLanguage.define(streamHttp);
export default http;
