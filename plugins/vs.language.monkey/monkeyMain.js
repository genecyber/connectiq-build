/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../declares.d.ts" />
'use strict';
define(["require", "exports", './monkeyDef', 'monaco'], function (require, exports, monkeyDef, monaco) {
    monaco.Modes.registerMonarchDefinition('monkey', monkeyDef.language);
});
