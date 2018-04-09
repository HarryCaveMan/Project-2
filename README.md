# EventHop

![EventHop Logo](public/img/EH.png "EventHop Logo")

## Application Description

EventHop is an application that allows users to choose from several different activities (restaurants, bars, baseball games, etc) to create a 'route' of activities that they can plan for an afternoon or night out!  

### Features

EventHop contains several prominent features:

	• Event Scheduling and Tracking 
	• Google Maps Location Search by Category (Cafe, Restaurant, etc...)
    • Group Event Creation and Sharing
	• User Authentication and Data Persistence
	• Pre-Planned Events


When the user loads the application they can login using the navbar at the top-right of the screen using their user name and password to get autheniticated for the site.  If they aren't registered they can also register using an email and password.  Logging in is not required to use EventHop, but it does allow the user to join and save the groups that they see in the application.  The user is then greeted by a splash page that gives the user three options:

**1. Create your own Group Route**

**2. Join a Group Route**

**3. Join an Event with other users**


#### Create Your Own Group Route

Users can choose from different categories to find the kind of event they are looking for, they can then link up to three different locations together to create a route that gives information and ratings for each location as well as how long it takes to walk to the next area (past a certain distance car travel time will be given instead).  The route is then saved to the user's account and will persist through login/logout.  The user also names the route and other users can then find and join the created group!  
 
#### Join a Group Route

 When a user clicks on this option, the page loads the five 'Group routes' with the most users on the map and it describes the five groups and where they are going below the map.  Users can also create a 'Group route' that other users can then join.  Groups are named by the original creator but any user can keep track of their groups when they login to EventHop.  Group markers on the map will display the number of users that are in the group, so the user can easily see how popular each specific group will be!
 
#### Join a Pre-Planned Event

EventHop also features pre-planned 'Events' that usually involve a meal, an activity, and one other stop.  Events will have a pre-determined amount of spots so be sure to sign up early!  These events are a great way to get out and meet/mingle with new people.  They are also ideal for tourists or people visiting from out of town.

## Tutorial and Guest Login

We've provided a guest login for curious users to check out the application without have to sign up!  The following walkthrough will take you step-by-step through creating a group, joining a group, and joining a pre-planned event.  Here are the guest credentials:

**guest@gmail.com**
**guest**




## APIs 
* [Google Maps](https://developers.google.com/maps/documentation/javascript/)
* [Google Places](https://developers.google.com/places/)
* [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/intro)
* [TinyURL](https://tinyurl.com/)
* [D3 Visualization](https://d3js.org/)
* [Stripe](https://stripe.com/docs/payment-request-api)

## Libraries and Technology
	• Heroku
	• Bootstrap 4
	• GSAP
	• Node.js
	• NPM
	• Express.js
	• Passport.js
	• passport.jwt
	• MySQL
	• Sequelize
	• Handlebars

## Known Bugs Being Investigated

- Google Maps dropdown is *sometimes* selecting the wrong location info
- The location info cards are coming back out of order, probably async issue (possible cause of first bug)

## Things to Come

We are planning on adding/making changes! Check back soon to see:

- A Google Maps view that shows the 5 most popular group routes on a single map together with marker grouping so the user can see how many people are signed up for each group on the map.

- Yelp review integration into the information cards retrieved for each location found by the map searches.

- Make the form at the bottom of the page usable

- UI improvements
## Our Dev Team - Worthless Without #c0ffee
	
##### **[Sharron Cooper](https://www.github.com/swcooper2014) - Frontend**
##### sharon@email.com

##### **[Tony Gottschalk](https://www.github.com/t-gottschalk) - Frontend**
##### tony.gottschalk2017@gmail.com 

##### **[Harris Joseph](https://www.github.com/HarryCaveMan) - Full-Stack**
##### harris@email.com

##### **[Zach Harmon](https://www.github.com/zachha) - Full-Stack**
##### zachha@gmail.com
	