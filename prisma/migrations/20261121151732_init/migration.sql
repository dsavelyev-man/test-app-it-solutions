-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(124) NOT NULL,
    "shortDescription" VARCHAR(600) NOT NULL,
    "links" VARCHAR(600)[],
    "skills" VARCHAR(124)[],

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "position" VARCHAR(124) NOT NULL,
    "startWork" TIMESTAMP(3) NOT NULL,
    "endWork" TIMESTAMP(3) NOT NULL,
    "achievements" VARCHAR(600)[],

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(124) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantToProject" (
    "id" SERIAL NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ApplicantToProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(124) NOT NULL,
    "link" VARCHAR(600) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantToProject" ADD CONSTRAINT "ApplicantToProject_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantToProject" ADD CONSTRAINT "ApplicantToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
