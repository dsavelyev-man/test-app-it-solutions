-- CreateIndex
CREATE INDEX "ApplicantToProject_applicantId_projectId_idx" ON "ApplicantToProject"("applicantId", "projectId");

-- CreateIndex
CREATE INDEX "Job_companyId_applicantId_idx" ON "Job"("companyId", "applicantId");
