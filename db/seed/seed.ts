import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { course } from "@/db/schema/course";

dotenv.config();

const nfeCourses = [
    { code: "0711-1101", name: "Introduction to Food Science and Technology" },
    { code: "0531-1103", name: "Physical Inorganic and Analytical Chemistry" },
    { code: "0531-1104", name: "Physical Inorganic and Analytical Chemistry Practical" },
    { code: "0231-111", name: "Communicative English" },
    { code: "0511-1105", name: "Basic Human Nutrition" },
    { code: "0611-1107", name: "Computer Fundamentals for Food Science" },
    { code: "0222-111", name: "History of the Emergence of Bangladesh" },
    { code: "0531-1201", name: "Organic Chemistry" },
    { code: "0531-1202", name: "Organic Chemistry Practical" },
    { code: "0541-111", name: "Mathematics" },
    { code: "0721-1203", name: "Unit Operations in Food Industries I" },
    { code: "0511-1205", name: "Food Microbiology" },
    { code: "0511-1206", name: "Food Microbiology Practical" },
    { code: "0511-1207", name: "Human Physiology" },
    { code: "0511-1208", name: "Human Physiology Practical" },
    { code: "0511-1209", name: "Social Nutrition" },
    { code: "0711-2101", name: "Food Chemistry" },
    { code: "0812-2103", name: "Fruits and Vegetable Technology" },
    { code: "0812-2104", name: "Fruits and Vegetable Technology Practical" },
    { code: "0413-2105", name: "Management and Marketing in Food Business" },
    { code: "0223-111", name: "Art of Living" },
    { code: "0721-2107", name: "Unit Operations in Food Industries II" },
    { code: "0721-2108", name: "Unit Operations in Food Industries Practical" },
    { code: "0542-2109", name: "Biostatistics" },
    { code: "0721-2201", name: "Engineering Properties of Food Materials" },
    { code: "0721-2203", name: "Baking and Confectionery Technology" },
    { code: "0721-2204", name: "Baking and Confectionary Technology Practical" },
    { code: "0511-2205", name: "Maternal and Child Nutrition" },
    { code: "0721-2207", name: "Dairy Technology" },
    { code: "0721-2208", name: "Dairy Technology Practical" },
    { code: "0512-2209", name: "Nutritional Biochemistry" },
    { code: "0512-2210", name: "Nutritional Biochemistry Practical" },
    { code: "0811-2211", name: "Technology of Meat Poultry and Fish Products" },
    { code: "0732-3101", name: "Epidemiology" },
    { code: "0511-3103", name: "Assessment of Nutritional Status" },
    { code: "0111-3105", name: "Nutrition Planning" },
    { code: "0711-3109", name: "Water and Beverage Technology" },
    { code: "0711-3110", name: "Water and Beverage Technology Practical" },
    { code: "0721-3111", name: "Food Preservation and Storage Engineering" },
    { code: "0721-3112", name: "Food Preservation and Storage Engineering Practical" },
    { code: "0311-3115", name: "Food Economics" },
    { code: "0512-3201", name: "Nutrigenomics and Biotechnology" },
    { code: "0421-3203", name: "Food Laws Regulations and Ethics" },
    { code: "0521-3205", name: "Environmental Food Technology" },
    { code: "0721-3207", name: "Food Packaging Engineering" },
    { code: "0721-3208", name: "Food Packaging Engineering Practical" },
    { code: "0111-3209", name: "Nutrition Education" },
    { code: "0915-3211", name: "Nutrition in Emergencies" },
    { code: "0031-411", name: "Employability" },
    { code: "0511-4101", name: "Dietetics" },
    { code: "0511-4102", name: "Dietetics Practical" },
    { code: "0542-4103", name: "Nutritional Data Management and Analysis" },
    { code: "0721-4105", name: "Sensory Science" },
    { code: "0512-4107", name: "Clinical Nutrition" },
    { code: "0512-4108", name: "Clinical Nutrition Practical" },
    { code: "0721-4109", name: "Food Safety and Quality Assurance" },
    { code: "0711-4111", name: "Advanced Methods of Food Analysis" },
    { code: "0711-4112", name: "Advanced Methods of Food Analysis Practical" },
    { code: "0721-4201", name: "Internship" },
    { code: "0721-4203", name: "Project Work" },
];

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);
    const NFE_DEPARTMENT_ID = 23;

    try {
        console.log("🌱 Seeding NFE courses...");

        const courseData = nfeCourses.map(c => ({
            name: c.name,
            courseCode: c.code,
            departmentId: NFE_DEPARTMENT_ID,
        }));

        await db.insert(course).values(courseData);

        console.log(`✅ Inserted ${courseData.length} NFE courses`);
        console.log("🎉 NFE course seeding completed!");
    } catch (error) {
        console.error("❌ NFE course seeding failed:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

main();
