const express = require("express");
const expressGraphQL = require("express-graphql");
const {GraphQLID,GraphQLString,GraphQLList,GraphQLObjectType,GraphQLSchema,GraphQLNonNull,GraphQLInt} = require("graphql");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;


var app = express();

mongoose.connect("mongodb+srv://kr3s0:puntizela44@kr3s0-pnznw.mongodb.net/test?retryWrites=true&w=majority");

const DriverModel = mongoose.model("driver",{
	firstname: String,
	lastname: String,
	team: String
});

const TeamModel = mongoose.model("team",{
	name: String,
	firstDriver: String,
	secondDriver: String,
	points: Number
});

const TeamType = new GraphQLObjectType({
	name: "Team",
	fields: {
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		firstDriver: {type: GraphQLString},
		secondDriver: {type: GraphQLString},
		points: {type: GraphQLInt}
	}
});

const DriverType = new GraphQLObjectType({
	name: "Driver",
	fields: {
		id: {type: GraphQLID},
		firstname: {type: GraphQLString},
		lastname: {type: GraphQLString},
		team: {type: GraphQLString}
	}
});


const schemaQ = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "Query",
		fields: {
			drivers: {
				type: GraphQLList(DriverType),
				resolve: (root, arg, context, info) => {
					return DriverModel.find().exec();
				}
			},
			driver: {
				type: DriverType,
				args: {
					id: {type: GraphQLNonNull(GraphQLID)}
				},
				resolve: (root, args, context, info) => {
					return DriverModel.findById(args.id).exec();
				}
			},
			teams: {
				type: GraphQLList(TeamType),
				resolve: (root, args, context, info) => {
					return TeamModel.find().exec();
				}
			},
			team: {
				type: TeamType,
				args: {
					id: {type: GraphQLNonNull(GraphQLID)}
				},
				resolve: (root, args, context, info) => {
					return TeamModel.findById(args.id).exec();
				}
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: "Mutation",
		fields: {
			driver: {
				type: DriverType,
				args: {
					firstname: {type: GraphQLNonNull(GraphQLString)},
					lastname: {type: GraphQLNonNull(GraphQLString)},
					team: {type: GraphQLString}
				},
				resolve: (root, args, context, info) => {
					var driver = new DriverModel(args);
					return driver.save();
				}
			},
			team: {
				type: TeamType,
				args: {
					name: {type: GraphQLNonNull(GraphQLString)},
					firstDriver: {type: GraphQLString},
					secondDriver: {type: GraphQLString},
					points: {type: GraphQLInt}
				},
				resolve: (root, args, context, info) => {
					var team = new TeamModel(args);
					return team.save();
				}
			}
		}
	}) 
})

app.use("/graphql",expressGraphQL({
	schema: schemaQ,
	graphiql: true
}));

app.get("/",(req, res, next) => {
	res.send("Idite na /graphql");
});

app.listen(port,()=>{
	console.log("Slusam na:"+port+"..");
});