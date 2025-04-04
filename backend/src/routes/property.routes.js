import { createProperty } from "../controllers/property.controller";
import { Router } from "express";
import { getAllProperties } from "../controllers/property.controller";
import { getOwnerProperties } from "../controllers/property.controller";
import { verifyJWT } from "../middlewares/auth.middleware";


const router=Router();

router.route("/createproperty").post(verifyJWT, createProperty);
router.route("/getallproperties").post(verifyJWT,getAllProperties);
router