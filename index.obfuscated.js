'use strict';function a0_0x5914(_0x1861fb,_0x308afd){const _0x20fbd1=a0_0x20fb();return a0_0x5914=function(_0x5914f4,_0x97b80e){_0x5914f4=_0x5914f4-0xea;let _0x389ca6=_0x20fbd1[_0x5914f4];return _0x389ca6;},a0_0x5914(_0x1861fb,_0x308afd);}const a0_0x1b9dc8=a0_0x5914;(function(_0xededc1,_0x2ec21e){const _0x370d46=a0_0x5914,_0x5d764c=_0xededc1();while(!![]){try{const _0x109c0e=-parseInt(_0x370d46(0x100))/0x1+-parseInt(_0x370d46(0x103))/0x2*(parseInt(_0x370d46(0xf3))/0x3)+parseInt(_0x370d46(0x105))/0x4+parseInt(_0x370d46(0xff))/0x5*(parseInt(_0x370d46(0xf4))/0x6)+parseInt(_0x370d46(0xf6))/0x7+-parseInt(_0x370d46(0xef))/0x8+parseInt(_0x370d46(0xee))/0x9;if(_0x109c0e===_0x2ec21e)break;else _0x5d764c['push'](_0x5d764c['shift']());}catch(_0x732dc){_0x5d764c['push'](_0x5d764c['shift']());}}}(a0_0x20fb,0xc0d89));var __importDefault=this&&this[a0_0x1b9dc8(0xfd)]||function(_0x529fb1){const _0x23de31=a0_0x1b9dc8;return _0x529fb1&&_0x529fb1[_0x23de31(0xfb)]?_0x529fb1:{'default':_0x529fb1};};Object[a0_0x1b9dc8(0xfe)](exports,a0_0x1b9dc8(0xfb),{'value':!![]});const body_parser_1=__importDefault(require(a0_0x1b9dc8(0xf7))),cors_1=__importDefault(require(a0_0x1b9dc8(0xec))),express_1=__importDefault(require(a0_0x1b9dc8(0xeb))),cors_config_1=__importDefault(require(a0_0x1b9dc8(0x104))),database_config_1=__importDefault(require(a0_0x1b9dc8(0xed))),router_config_1=__importDefault(require(a0_0x1b9dc8(0x101)));function a0_0x20fb(){const _0x4d2656=['Server\x20is\x20running\x20on\x20http://localhost:','2174919mJsWoi','2892174cwMbTH','listen','8125943alidhf','body-parser','log','PORT','default','__esModule','use','__importDefault','defineProperty','10xaJqvV','1013974flZZdP','./config/router.config','json','2SvUjll','./config/cors.config','5676208zEWdBz','then','express','cors','./config/database.config','1797795dAYMFY','9718960rwGZmb','config','dotenv'];a0_0x20fb=function(){return _0x4d2656;};return a0_0x20fb();}require(a0_0x1b9dc8(0xf1))[a0_0x1b9dc8(0xf0)]();const app=(0x0,express_1[a0_0x1b9dc8(0xfa)])(),PORT=process['env'][a0_0x1b9dc8(0xf9)]||0xbb9;app[a0_0x1b9dc8(0xfc)](body_parser_1[a0_0x1b9dc8(0xfa)][a0_0x1b9dc8(0x102)]()),app['use'](body_parser_1[a0_0x1b9dc8(0xfa)]['urlencoded']({'extended':!![]})),app[a0_0x1b9dc8(0xfc)]((0x0,cors_1[a0_0x1b9dc8(0xfa)])(cors_config_1[a0_0x1b9dc8(0xfa)])),(0x0,router_config_1[a0_0x1b9dc8(0xfa)])(app),(0x0,database_config_1[a0_0x1b9dc8(0xfa)])()[a0_0x1b9dc8(0xea)](()=>{const _0x45f647=a0_0x1b9dc8;app[_0x45f647(0xf5)](PORT,()=>{const _0x3b1ab5=_0x45f647;console[_0x3b1ab5(0xf8)](_0x3b1ab5(0xf2)+PORT);});});