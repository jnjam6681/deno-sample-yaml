// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";

import { json2yaml } from "https://deno.land/x/json2yaml@v1.0.1/mod.ts";
import { xml2js } from "https://deno.land/x/xml2js@1.0.0/mod.ts";

import axios from "axios";
import * as yaml from "yaml";

export { _, axios, json2yaml, xml2js, yaml };

