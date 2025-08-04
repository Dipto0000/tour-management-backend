import { excludeField } from "../../constants";
import { tourSearchableFields } from "./tour.constants";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";



const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    const tour = await Tour.create(payload)

    return tour;
}

const getAllTours = async (query: Record<string,string>) => {

        const filter = query;
        const searchTerm = query.searchTerm || "";
        const sort = query.sort || "";
        const fields = query.fields?.split(",").join(" ") || "";
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit


        // delete filter["searchTerm"];

        for(const field of excludeField){
            delete filter[field]
        }

        const searchQuery = {
            $or: tourSearchableFields.map(field => ({[field]: {$regex: searchTerm, $options: "i"}}))
        }

        const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

        const totalTours = await Tour.countDocuments();
        const totalPage = Math.ceil(totalTours / limit);
        return {
            data: tours,
            meta: {
                page: page,
                limit: limit,
                total: totalTours,
                totalPage: totalPage,
            }
        }
}



export const TourService = {
    createTour,
    getAllTours,
}

