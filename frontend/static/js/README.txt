Docs:
1. main.js
  Takes care about a few things:
  1. set up routes: dictionary of format {<link>: <corresponding class>}
  2. create a hot loader <Main> that changes document content depending on links
  3. instantiate menu as a singletone class that is present on every single page
  4. as the project is a file, not a webpage, catch every link and prevent going to another file

2. supplies
  The core logic is implemented in these files, each one is provided with a complete documentation

3. services
  These files operate with browser logic (canvas.js, cookies.js, scheme.js), store info (trends.js, colors.js), communicate with api (auth.js) or handle form inputs (field.js)

4. components
  These classes are responsible for dynamic html and js, each one has these methods:
  1. render() -> interpolated string - used for rendering dynamic html and is called every time inner state changes
  2. init() -> void - used for preparing class for work

  Almost every class has these methods:
  1. setStaticEventListeners - sets event listeners, is called only in init
  2. setDynamicEventListeners - sets event listeners, is called every time class rerenders it's content
  2. reload - updates specific element with new content when inner state changes
  3. getReloadable -> interpolated string - returns dynamic content that can be changed by users in runtime