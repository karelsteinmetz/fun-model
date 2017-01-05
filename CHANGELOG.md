CHANGELOG
===
2.0.0
--

New Features
-

Added state freezing on each setState calling in debug mode. This supports detection of immutability violation in development by throwing exception. Debug mode is enabled if you have set debugCallback in bootstraping. Thanks for the idea of GMC Software Team.

1.3.0
--

New Features
-

Added "types": "index.d.ts" into package.json. Supported by TS 2.0.

1.2.0
--

New Features
-

Switched js compilation from es6 to commonjs es5.

1.1.0
--

New Features
-

State lock in action handling. Now you can call other actions in action or you can create controller actions which wraps your more specific actions.