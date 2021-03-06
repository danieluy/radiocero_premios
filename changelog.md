# Radiocero Premios
## Changelog
### ToDo
 - Solve DsForm dependency
 - Redo the whole grant prize api
### v2.2.0
* 20170927 | P | Added DsForm dependency (work in progress)
### v2.1.0
* 20170926 | P | Solved POST /grantprize frontend
* 20170926 | P | Added babel spread operator loader
* 20170926 | P | Added source maps to Webpack config
* 20170922 | P | Added remaining fields of GrantPrizeForm
* 20170922 | R | Changelog updated to comply with Markdown format
* 20170921 | P | Implemented upfront CI verification on GrantPrizeForm
* 20170920 | P | Added GrantPrizeForm component, working on it's functionality
* 20170920 | P | Implemented react-virtual-list on Prizes component
* 20170919 | P | Added minimal stats to Winners and Prizes list SubHeaders
* 20170919 | P | Implemented react-virtual-list on Winners component
* 20170919 | P | Updated development DB version to currrent productions version
* 20170919 | P | Added cancel handover Prize functionality
* 20170918 | P | Added handover Prize functionality
* 20170915 | P | Added display Prize functionality on WinnerPrizes re-using PrizeCard component
* 20170914 | P | Added WinnerPrizes list
* 20170913 | P | Added copy functionality to contat actions on WinnersCard
* 20170912 | P | Added npm dependency clipboard
* 20170912 | P | Added WinnersCard's contact actions as popover
* 20170908 | P | Started Winners section
* 20170908 | P | Prizes CRUD ready
* 20170907 | P | Delete Prize functionality ready
* 20170907 | P | Improved color usage throughout the app
* 20170906 | P | Added permission description to check with client
* 20170906 | P | Added EditPrizeForm
* 20170905 | P | Improved PrizeCard's displayed stock info
* 20170904 | P | Added ignore accents marks on prizes search
* 20170901 | P | Added filter controls on Prizes toolbar
* 20170901 | P | Added filters on Prizes
* 20170830 | P | Added prizes cards
* 20170829 | P | Added add Prize functionality for any user
* 20170828 | P | Added session.checkLoggedUser()
* 20170828 | P | Added Drawer permissions filter
* 20170824 | P | Started Prizes section
* 20170824 | P | Improved logout, it now redirects to home
* 20170824 | P | Added Home section
* 20170824 | P | Added login listener in Drawer
* 20170824 | P | Improved Drawer UI
* 20170823 | P | Added styles Users.scss
* 20170823 | P | Added links to users when listed
* 20170823 | P | Solved sharing props to components on routes
* 20170823 | P | Added add user functionality for administrators
* 20170822 | P | Improved Drawer header UI
* 20170822 | P | Added FAB for adding users functionality
* 20170822 | P | Added password reset functionality for administrators
* 20170822 | P | Added edit and delete options to Users
* 20170818 | P | Added basic Users section
* 20170818 | P | Added react-router v4
* 20170818 | P | Added v2-router for /v2/* routes
* 20170818 | P | Added working login/logout functionality
### v2.0.0
* 20170816 | P | Solved comunication with server
* 20170816 | P | Started front end rewrite on React
### v0.7.1
* 20170217 | F4 | the problem was the total un-implementation of the total_handed attribute :\
* 20170217 | B4 | when updateing prizes data from periodic to stock total_handed gets null 
* 20170217 | F3 | it was a wider problem, missing "this" reference when calling Prize.update() 
* 20170217 | B3 | granting periodic prizes is not working
* 20170217 | F2 | the methods findAll() and findOne() weren't geting they reference of Winner through winnerBinder()
* 20170215 | B2 | new Winner() is getting undefined at values (winners.js:5:14)
* 20170215 | R | winners.js to be testable
* 20170214 | P | Started to unit test winners.js
* 20170214 | R | Winner class to use this keyword
* 20170214 | F1 | Return statement missing on Prize.stockIncrease() and Prize.stockDecrease()
* 20170213 | B1 | Error at handling periodic prizes, somehow it finds that stock is not enough
* 20170210 | P | Added functionality to return prizes. Route "api/winners/cancelHandprize"
* 20170210 | P | Test Winner.hasWonSinceThreeMonths()
### v0.7.0
* 20170207 | P | Prize.edit() now uses Prize.checkInputData() instead of just checking if the data was provided
* 20170203 | R | Added Prize.checkInputData() to re-use this functionality
* 20170203 | R | Completely redone the prizes instantiation checks
* 20170131 | P | Added verification for periodic parameter on Prize class
* 20170131 | R | Prize class to have its methods declared through its prototype
### v0.6.2
* 20170130 | R | Prize class to use this keyword
* 20170130 | P | Added periodic: boolean to Prize class
* 20170130 | P | Added total_handed:number to Prize class
### v0.6.1
* 20170129 | P | Updated and improved the README.md
* 20170129 | P | Greatly improved the CLI UX
* 20170129 | P | Moved to a fresh repository
* 20170129 | M | Removed unused dependencies
### v0.6.0
* 20170125 | P | Added /prizes/edit api_router route and method
* 20170125 | P | Added Prize.edit() method
* 20170116 | P | Added method to check if a winner has won in the last three months
* 20170113 | P | Added ng-client
* 20170113 | M | Removed old client
* 20170110 | M | Removed the json-api router
* 20170108 | P | Authentication enabled
* 20161222 | P | Added /json/winners/handprize method to json-api-router.js
### v0.5.1
* 20161221 | P | Started a new client app based on Angular 2
* 20161221 | F | set_date on users was assigned as due_date and consequently it defaulted to the instantiation date
### v0.5.0
* 19700101 | F | everything about the prize's stock is broken, assigning prizes is working now, stock management included ;)
* 19700101 | P | Added prize handing over functionality on backend
* 19700101 | P | When adding a new prize, the prize's list in now updated
* 19700101 | P | Added administrator account creation on first boot
* 19700101 | P | Added users management, without server side checks
### v0.4.4
* 19700101 | P | Added ejs partials
* 19700101 | F | Solved a bug on index.js that was sending non UTC date to the server
* 19700101 | F | Solved a bug on index.js that didn't refresh the content position when the window was resized
* 19700101 | P | Added the form to grant prizes
* 19700101 | P | Added Winners module
* 19700101 | P | Added info_hub actions
* 19700101 | F | Solved grantPrize() on fontend's winner.js
* 19700101 | F | Solved Dates and comments displaying even if they are null
* 19700101 | BUG | everything about the prizes stock is broken!!!!
### v0.4.3
* 19700101 | P | Added tab navigation
* 19700101 | P | Added User's list style
* 19700101 | P | Added new navigation system
* 19700101 | P | Added DS-Spinners
* 19700101 | P | Added delay option to ds-ajax.js
### v0.4.2
* 19700101 | P | Added Form's UI design
* 19700101 | P | Added suggested prize types from the existing prize types in the database
* 19700101 | P | The method findAll at prizes.js and users.js now returns an empty Array instead of null when there is no results
* 19700101 | P | Added PUT method to ds_ajax.js
* 19700101 | P | Added date format control in the prizes.js module
* 19700101 | P | Added :valid and :invalid pseudo classes style to input, textarea and select tags within div.content-form
* 19700101 | P | Added info-hub to display messages
* 19700101 | P | New prize's UI to back-end connection finished
* 19700101 | P | Refined forms UI
* 19700101 | P | Added resert functionality to forms
### v0.4.1
* 19700101 | P | Added concurrently dev-dependency to run MongoDB along with app.js
* 19700101 | P | Started to normalize sintaxis
* 19700101 | P | Current status of modules users.js and prizes.js was correctly tested
#### References
| Ref. | Meaning |
| ------ | ------ |
| P | Added something (plus) |
| M | Removed something (minus) |
| R | Refactoring |
| B | Bug |
| F | Bug fix |