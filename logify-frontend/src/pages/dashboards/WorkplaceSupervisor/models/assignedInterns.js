import { api } from "../../../../config/api";

export class AssignedInterns {
    // Fixed: Removed the extra curly brace
    constructor(internsArray, length) { 
        this.interns = internsArray;
        this.totalInterns = length;
    }
}

export const assignedInternsRepository = {
    async getAssignedInterns() {
        try {
            const assignedInternsData = await api.placements.getPlacements();
            console.log('Assigned Interns Data:', assignedInternsData);

            // Safety check: ensure data is an array before mapping
            if (!Array.isArray(assignedInternsData)) {
                return new AssignedInterns([], 0);
            }

            const internsArray = assignedInternsData.map(intern => ({
                url: intern.avatar_url,
                intern_id: intern.id,
                end_date: intern.end_date,
                start_date: intern.start_date,
                // Calculation for weeks
                week: Math.ceil((new Date(intern.end_date) - new Date(intern.start_date)) / (1000 * 60 * 60 * 24 * 7)),
                institution: intern.institution_name,
                intern_name: `${intern.intern_first_name} ${intern.intern_last_name}`,
                course: intern.programme_name,
                organization: intern.organization_name,
                email: intern.intern_email,
            }));

            // Fixed: Dynamically get the length instead of hardcoding '3'
            const length = internsArray.length; 
            
            console.log('Object', internsArray);
            console.log('Length', length);
            
            return new AssignedInterns(internsArray, length);

        } catch (error) {
            console.error("Failed to fetch assigned interns:", error);
            // Return empty state on error to prevent app crash
            return new AssignedInterns([], 0);
        }
    }
}