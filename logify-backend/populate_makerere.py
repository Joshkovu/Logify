import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.academics.models import Institutions, Colleges, Departments, Programmes

def populate():
    # 1. Get or create Makerere Institution
    mak, _ = Institutions.objects.get_or_create(
        name="Makerere University",
        defaults={"email_domain": "mak.ac.ug"}
    )

    colleges_data = {
        "College of Computing and Information Sciences (CoCIS)": [
            "Department of Computer Science",
            "Department of Information Systems",
            "Department of Information Technology",
            "Department of Library and Information Science",
            "Department of Networks",
            "Department of Records and Archives Management"
        ],
        "College of Agricultural and Environmental Sciences (CAES)": [
            "Department of Agricultural Production",
            "Department of Agribusiness and Natural Resource Economics",
            "Department of Extension and Innovation Studies",
            "Department of Agricultural and Biosystems Engineering",
            "Department of Food Technology and Human Nutrition",
            "Department of Forestry, Bio-diversity and Tourism",
            "Department of Environmental Management",
            "Department of Geography, Geo-informatics and Climatic Sciences"
        ],
        "College of Business and Management Sciences (CoBAMS)": [
            "Department of Economic Theory and Analysis",
            "Department of Policy and Development Economics",
            "Department of Accounting and Finance",
            "Department of Marketing and Management",
            "Department of Planning and Applied Statistics",
            "Department of Population Studies",
            "Department of Statistical Methods and Actuarial Science"
        ],
        "College of Engineering, Design, Art and Technology (CEDAT)": [
            "Department of Civil and Environmental Engineering",
            "Department of Electrical and Computer Engineering",
            "Department of Mechanical Engineering",
            "Department of Architecture and Physical Planning",
            "Department of Construction Economics and Management",
            "Department of Geomatics and Land Management",
            "Department of Urban and Regional Planning",
            "Department of Fine Art",
            "Department of Industrial Art and Applied Design",
            "Department of Visual Communication Design and Multimedia"
        ],
        "College of Health Sciences (CHS)": [],
        "College of Humanities and Social Sciences (CHUSS)": [],
        "College of Natural Sciences (CoNAS)": [],
        "College of Education and External Studies (CEES)": [],
        "College of Veterinary Medicine, Animal Resources and Bio-security (CoVAB)": [],
        "School of Law": []
    }

    for college_name, departments in colleges_data.items():
        college, _ = Colleges.objects.get_or_create(
            institution=mak,
            name=college_name
        )
        for dept_name in departments:
            department, _ = Departments.objects.get_or_create(
                college=college,
                name=dept_name
            )

            # Ensure each department has at least one programme for signup flows.
            if not Programmes.objects.filter(department=department).exists():
                programme_name = f"Bachelors in {dept_name.replace('Department of ', '')}".strip()
                Programmes.objects.get_or_create(
                    department=department,
                    name=programme_name,
                    defaults={
                        "level": "Undergraduate",
                        "duration_years": 4,
                    },
                )

    print("Makerere University data populated successfully.")

if __name__ == "__main__":
    populate()
