import {MongoClient} from "mongodb";
import {url} from "./connect";

export const client = new MongoClient(url)