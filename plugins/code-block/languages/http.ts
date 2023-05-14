import { http as streamHttp } from '@codemirror/legacy-modes/mode/http';
import { StreamLanguage } from '@codemirror/language';

const http = () => StreamLanguage.define(streamHttp);
export default http;
