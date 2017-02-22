CHANGELOG
===
4.2.0
--

New Features
-

Actions in setter variant. Function createAction has a default handler working as setter.


4.1.0
--

New Features
-

Added withExceptionHandling optional bootstrap parameter. It should be useful in dev. mode.

4.0.0
--

New Features
-

Removed createAsyncAction.

3.0.0
--

New Features
-

Created bootstrapping optional parameters with state freezing option.

2.3.0
--

New Features
-

Used tsc code restrictions.

2.2.0
--

New Features
-

Fixed shallow copying on array. Now shallow copy can be used for arrays.

2.1.0
--

New Features
-

Added state creation on each setState if cursor key does not exist. This supports dynamic state creation. Now you do not need prepaire full state before bootsraping. Do not forget initilize default state for your component in init. Default state is empty object ({}). 

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