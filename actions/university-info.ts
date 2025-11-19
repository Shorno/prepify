"use server"
import {db} from "@/db/config";

export async function getFacultiesWithDepartments() {
    return db.query.faculty.findMany({
            with: {departments: true}
        }
    )
}

export async function getBatches(){
    return db.query.batch.findMany()
}

export async function getCoursesByDepartment(id: number){
    return db.query.course.findMany({
        where: (courses, {eq}) => eq(courses.departmentId, id)
    })
}