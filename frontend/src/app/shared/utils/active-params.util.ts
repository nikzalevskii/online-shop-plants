import {ActiveParamsType} from "../../../types/active-params.type";
import {DIAMETER_FROM, DIAMETER_TO, HEIGHT_FROM, HEIGHT_TO, PAGE, SORT, TYPES} from "../constants/constants";
import {Params} from "@angular/router";

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {

    const activeParams: ActiveParamsType = {types: []};
    if (params.hasOwnProperty(TYPES)) {
      activeParams.types = Array.isArray(params[TYPES]) ? params[TYPES] : [params[TYPES]];
      // activeParams.types = params[TYPES];
    }
    if (params.hasOwnProperty(HEIGHT_FROM)) {
      activeParams.heightFrom = params[HEIGHT_FROM];
    }
    if (params.hasOwnProperty(HEIGHT_TO)) {
      activeParams.heightTo = params[HEIGHT_TO];
    }
    if (params.hasOwnProperty(DIAMETER_FROM)) {
      activeParams.diameterFrom = params[DIAMETER_FROM];
    }
    if (params.hasOwnProperty(DIAMETER_TO)) {
      activeParams.diameterTo = params[DIAMETER_TO];
    }
    if (params.hasOwnProperty(SORT)) {
      activeParams.sort = params[SORT];
    }
    if (params.hasOwnProperty(PAGE)) {
      activeParams.page = +params[PAGE];
    }
    return activeParams;
  }
}
