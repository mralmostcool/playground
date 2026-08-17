openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
servers:
  - url: http://localhost
    description: Generated server url
paths:
  /api/vessels/{id}:
    get:
      tags:
        - vessel-controller
      operationId: getVesselById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/VesselResponseDTO"
    put:
      tags:
        - vessel-controller
      operationId: updateVessel
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/VesselRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/VesselResponseDTO"
    delete:
      tags:
        - vessel-controller
      operationId: deleteVessel
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - vessel-controller
      operationId: patchVessel
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/VesselPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/VesselResponseDTO"
  /api/ranks/{id}:
    get:
      tags:
        - rank-master-controller
      operationId: getRankById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/RankMasterResponseDTO"
    put:
      tags:
        - rank-master-controller
      operationId: updateRank
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RankMasterRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/RankMasterResponseDTO"
    delete:
      tags:
        - rank-master-controller
      operationId: deleteRank
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - rank-master-controller
      operationId: patchRank
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RankMasterPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/RankMasterResponseDTO"
  /api/pre-sea-courses/{id}:
    get:
      tags:
        - pre-sea-courses-controller
      operationId: getCourseById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/PreSeaCoursesResponseDTO"
    put:
      tags:
        - pre-sea-courses-controller
      operationId: updateCourse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PreSeaCoursesRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/PreSeaCoursesResponseDTO"
    delete:
      tags:
        - pre-sea-courses-controller
      operationId: deleteCourse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - pre-sea-courses-controller
      operationId: patchCourse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PreSeaCoursesPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/PreSeaCoursesResponseDTO"
  /api/institutes/{id}:
    get:
      tags:
        - institute-controller
      operationId: getInstituteById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/InstituteResponseDTO"
    put:
      tags:
        - institute-controller
      operationId: updateInstitute
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/InstituteRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/InstituteResponseDTO"
    delete:
      tags:
        - institute-controller
      operationId: deleteInstitute
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - institute-controller
      operationId: patchInstitute
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/InstitutePatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/InstituteResponseDTO"
  /api/indos/{id}:
    get:
      tags:
        - indos-master-controller
      operationId: getIndosById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/IndosMasterResponseDTO"
    put:
      tags:
        - indos-master-controller
      operationId: updateIndos
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/IndosMasterRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/IndosMasterResponseDTO"
    delete:
      tags:
        - indos-master-controller
      operationId: deleteIndos
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - indos-master-controller
      operationId: patchIndos
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/IndosMasterPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/IndosMasterResponseDTO"
  /api/enrollments/{id}:
    get:
      tags:
        - enrollment-controller
      operationId: getEnrollmentById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/EnrollmentResponseDTO"
    put:
      tags:
        - enrollment-controller
      operationId: updateEnrollment
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EnrollmentRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/EnrollmentResponseDTO"
    delete:
      tags:
        - enrollment-controller
      operationId: deleteEnrollment
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - enrollment-controller
      operationId: patchEnrollment
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EnrollmentPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/EnrollmentResponseDTO"
  /api/contracts/{id}:
    get:
      tags:
        - contract-controller
      operationId: getContractById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/ContractResponseDTO"
    put:
      tags:
        - contract-controller
      operationId: updateContract
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ContractRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/ContractResponseDTO"
    delete:
      tags:
        - contract-controller
      operationId: deleteContract
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - contract-controller
      operationId: patchContract
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ContractPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/ContractResponseDTO"
  /api/companies/{id}:
    get:
      tags:
        - company-controller
      operationId: getCompanyById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/CompanyResponseDTO"
    put:
      tags:
        - company-controller
      operationId: updateCompany
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CompanyRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/CompanyResponseDTO"
    delete:
      tags:
        - company-controller
      operationId: deleteCompany
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - company-controller
      operationId: patchCompany
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CompanyPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/CompanyResponseDTO"
  /api/berths/{id}:
    get:
      tags:
        - berth-controller
      operationId: getBerthById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthResponseDTO"
    put:
      tags:
        - berth-controller
      operationId: updateBerth
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthResponseDTO"
    delete:
      tags:
        - berth-controller
      operationId: deleteBerth
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - berth-controller
      operationId: patchBerth
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthResponseDTO"
  /api/berth-seafarer-allocations/{id}:
    get:
      tags:
        - berth-seafarer-allocation-controller
      operationId: getAllocationById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthSeafarerAllocationResponseDTO"
    put:
      tags:
        - berth-seafarer-allocation-controller
      operationId: updateAllocation
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthSeafarerAllocationRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthSeafarerAllocationResponseDTO"
    delete:
      tags:
        - berth-seafarer-allocation-controller
      operationId: deleteAllocation
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - berth-seafarer-allocation-controller
      operationId: patchAllocation
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthSeafarerAllocationPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthSeafarerAllocationResponseDTO"
  /api/berth-allocations/{id}:
    get:
      tags:
        - berth-allocation-controller
      operationId: getAllocationById_1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthAllocationResponseDTO"
    put:
      tags:
        - berth-allocation-controller
      operationId: updateAllocation_1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthAllocationRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthAllocationResponseDTO"
    delete:
      tags:
        - berth-allocation-controller
      operationId: deleteAllocation_1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - berth-allocation-controller
      operationId: patchAllocation_1
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthAllocationPatchRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthAllocationResponseDTO"
  /api/vessels:
    get:
      tags:
        - vessel-controller
      operationId: getAllVessels
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/VesselResponseDTO"
    post:
      tags:
        - vessel-controller
      operationId: createVessel
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/VesselRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/VesselResponseDTO"
  /api/ranks:
    get:
      tags:
        - rank-master-controller
      operationId: getAllRanks
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/RankMasterResponseDTO"
    post:
      tags:
        - rank-master-controller
      operationId: createRank
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RankMasterRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/RankMasterResponseDTO"
  /api/pre-sea-courses:
    get:
      tags:
        - pre-sea-courses-controller
      operationId: getAllCourses
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/PreSeaCoursesResponseDTO"
    post:
      tags:
        - pre-sea-courses-controller
      operationId: createCourse
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PreSeaCoursesRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/PreSeaCoursesResponseDTO"
  /api/institutes:
    get:
      tags:
        - institute-controller
      operationId: getAllInstitutes
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/InstituteResponseDTO"
    post:
      tags:
        - institute-controller
      operationId: createInstitute
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/InstituteRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/InstituteResponseDTO"
  /api/indos:
    get:
      tags:
        - indos-master-controller
      operationId: getAllIndos
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/IndosMasterResponseDTO"
    post:
      tags:
        - indos-master-controller
      operationId: createIndos
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/IndosMasterRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/IndosMasterResponseDTO"
  /api/enrollments:
    get:
      tags:
        - enrollment-controller
      operationId: getAllEnrollments
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/EnrollmentResponseDTO"
    post:
      tags:
        - enrollment-controller
      operationId: createEnrollment
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EnrollmentRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/EnrollmentResponseDTO"
  /api/contracts:
    get:
      tags:
        - contract-controller
      operationId: getAllContracts
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/ContractResponseDTO"
    post:
      tags:
        - contract-controller
      operationId: createContract
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ContractRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/ContractResponseDTO"
  /api/companies:
    get:
      tags:
        - company-controller
      operationId: getAllCompanies
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/CompanyResponseDTO"
    post:
      tags:
        - company-controller
      operationId: createCompany
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CompanyRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/CompanyResponseDTO"
  /api/berths:
    get:
      tags:
        - berth-controller
      operationId: getAllBerths
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/BerthResponseDTO"
    post:
      tags:
        - berth-controller
      operationId: createBerth
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthResponseDTO"
  /api/berth-seafarer-allocations:
    get:
      tags:
        - berth-seafarer-allocation-controller
      operationId: getAllAllocations
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/BerthSeafarerAllocationResponseDTO"
    post:
      tags:
        - berth-seafarer-allocation-controller
      operationId: createAllocation
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthSeafarerAllocationRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthSeafarerAllocationResponseDTO"
  /api/berth-allocations:
    get:
      tags:
        - berth-allocation-controller
      operationId: getAllAllocations_1
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/BerthAllocationResponseDTO"
    post:
      tags:
        - berth-allocation-controller
      operationId: createAllocation_1
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BerthAllocationRequestDTO"
        required: true
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/BerthAllocationResponseDTO"
  /api/audit-logs:
    get:
      tags:
        - audit-logs-controller
      operationId: getAllAuditLogs
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/AuditLogsResponseDTO"
  /api/audit-logs/{id}:
    get:
      tags:
        - audit-logs-controller
      operationId: getAuditLogById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
          content:
            "*/*":
              schema:
                $ref: "#/components/schemas/AuditLogsResponseDTO"
components:
  schemas:
    VesselRequestDTO:
      type: object
      properties:
        imo:
          type: string
          maxLength: 10
          minLength: 0
        name:
          type: string
          maxLength: 128
          minLength: 0
        flag:
          type: string
          maxLength: 64
          minLength: 0
        isActive:
          type: boolean
      required:
        - flag
        - imo
        - isActive
        - name
    VesselResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        imo:
          type: string
        name:
          type: string
        flag:
          type: string
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    RankMasterRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 64
          minLength: 0
        level:
          type: integer
          format: int32
      required:
        - level
        - name
    RankMasterResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        level:
          type: integer
          format: int32
        createdAt:
          type: string
          format: date-time
    PreSeaCoursesRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 0
        isActive:
          type: boolean
        startDate:
          type: string
          format: date
        instituteId:
          type: string
          format: uuid
      required:
        - isActive
        - name
        - startDate
    PreSeaCoursesResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        isActive:
          type: boolean
        startDate:
          type: string
          format: date
        instituteId:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    InstituteRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 0
      required:
        - name
    InstituteResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    IndosMasterRequestDTO:
      type: object
      properties:
        indos:
          type: string
          maxLength: 7
          minLength: 7
        firstName:
          type: string
          maxLength: 255
          minLength: 0
        rankId:
          type: string
          format: uuid
        isActive:
          type: boolean
      required:
        - firstName
        - indos
        - isActive
        - rankId
    IndosMasterResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        indos:
          type: string
        firstName:
          type: string
        rankId:
          type: string
          format: uuid
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    EnrollmentRequestDTO:
      type: object
      properties:
        preSeaCourseId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - ENROLLED
            - COMPLETED
            - CANCELLED
        remarks:
          type: string
      required:
        - indosMasterId
        - preSeaCourseId
    EnrollmentResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        preSeaCourseId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - ENROLLED
            - COMPLETED
            - CANCELLED
        remarks:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    ContractRequestDTO:
      type: object
      properties:
        indosMasterId:
          type: string
          format: uuid
        companyId:
          type: string
          format: uuid
        enrollmentId:
          type: string
          format: uuid
        berthSeafarerAllocationId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - DRAFT
            - ACTIVE
            - COMPLETED
            - TERMINATED
        signOnDate:
          type: string
          format: date-time
        signOnPort:
          type: string
          maxLength: 128
          minLength: 0
        signOnCountry:
          type: string
          maxLength: 128
          minLength: 0
        signOffDate:
          type: string
          format: date-time
        signOffPort:
          type: string
          maxLength: 128
          minLength: 0
        signOffCountry:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOnDate:
          type: string
          format: date-time
        actualSignOnPort:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOnCountry:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOffDate:
          type: string
          format: date-time
        actualSignOffPort:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOffCountry:
          type: string
          maxLength: 128
          minLength: 0
        remarks:
          type: string
      required:
        - berthSeafarerAllocationId
        - companyId
        - enrollmentId
        - indosMasterId
        - signOffCountry
        - signOffDate
        - signOffPort
        - signOnCountry
        - signOnDate
        - signOnPort
    ContractResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        companyId:
          type: string
          format: uuid
        enrollmentId:
          type: string
          format: uuid
        berthSeafarerAllocationId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - DRAFT
            - ACTIVE
            - COMPLETED
            - TERMINATED
        signOnDate:
          type: string
          format: date-time
        signOnPort:
          type: string
        signOnCountry:
          type: string
        signOffDate:
          type: string
          format: date-time
        signOffPort:
          type: string
        signOffCountry:
          type: string
        actualSignOnDate:
          type: string
          format: date-time
        actualSignOnPort:
          type: string
        actualSignOnCountry:
          type: string
        actualSignOffDate:
          type: string
          format: date-time
        actualSignOffPort:
          type: string
        actualSignOffCountry:
          type: string
        remarks:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    CompanyRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 0
        registrationNo:
          type: string
          maxLength: 64
          minLength: 0
        isActive:
          type: boolean
      required:
        - isActive
        - name
    CompanyResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        registrationNo:
          type: string
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    BerthRequestDTO:
      type: object
      properties:
        berthName:
          type: string
          maxLength: 128
          minLength: 0
        isActive:
          type: boolean
      required:
        - berthName
        - isActive
    BerthResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        berthName:
          type: string
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    BerthSeafarerAllocationRequestDTO:
      type: object
      properties:
        berthId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        berthAllocationId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
      required:
        - berthId
        - endDate
        - indosMasterId
        - startDate
    BerthSeafarerAllocationResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        berthId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        berthAllocationId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    BerthAllocationRequestDTO:
      type: object
      properties:
        berthId:
          type: string
          format: uuid
        vesselId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
      required:
        - berthId
        - endDate
        - startDate
        - vesselId
    BerthAllocationResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        berthId:
          type: string
          format: uuid
        vesselId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    VesselPatchRequestDTO:
      type: object
      properties:
        imo:
          type: string
          maxLength: 10
          minLength: 1
        name:
          type: string
          maxLength: 128
          minLength: 1
        flag:
          type: string
          maxLength: 64
          minLength: 1
        isActive:
          type: boolean
    RankMasterPatchRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 64
          minLength: 1
        level:
          type: integer
          format: int32
    PreSeaCoursesPatchRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 1
        isActive:
          type: boolean
        startDate:
          type: string
          format: date
        instituteId:
          type: string
          format: uuid
    InstitutePatchRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 1
    IndosMasterPatchRequestDTO:
      type: object
      properties:
        indos:
          type: string
          maxLength: 7
          minLength: 7
        firstName:
          type: string
          maxLength: 255
          minLength: 1
        rankId:
          type: string
          format: uuid
        isActive:
          type: boolean
    EnrollmentPatchRequestDTO:
      type: object
      properties:
        preSeaCourseId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - ENROLLED
            - COMPLETED
            - CANCELLED
        remarks:
          type: string
    ContractPatchRequestDTO:
      type: object
      properties:
        indosMasterId:
          type: string
          format: uuid
        companyId:
          type: string
          format: uuid
        enrollmentId:
          type: string
          format: uuid
        berthSeafarerAllocationId:
          type: string
          format: uuid
        status:
          type: string
          enum:
            - DRAFT
            - ACTIVE
            - COMPLETED
            - TERMINATED
        signOnDate:
          type: string
          format: date-time
        signOnPort:
          type: string
          maxLength: 128
          minLength: 0
        signOnCountry:
          type: string
          maxLength: 128
          minLength: 0
        signOffDate:
          type: string
          format: date-time
        signOffPort:
          type: string
          maxLength: 128
          minLength: 0
        signOffCountry:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOnDate:
          type: string
          format: date-time
        actualSignOnPort:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOnCountry:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOffDate:
          type: string
          format: date-time
        actualSignOffPort:
          type: string
          maxLength: 128
          minLength: 0
        actualSignOffCountry:
          type: string
          maxLength: 128
          minLength: 0
        remarks:
          type: string
    CompanyPatchRequestDTO:
      type: object
      properties:
        name:
          type: string
          maxLength: 255
          minLength: 1
        registrationNo:
          type: string
          maxLength: 64
          minLength: 1
        isActive:
          type: boolean
    BerthPatchRequestDTO:
      type: object
      properties:
        berthName:
          type: string
          maxLength: 128
          minLength: 1
        isActive:
          type: boolean
    BerthSeafarerAllocationPatchRequestDTO:
      type: object
      properties:
        berthId:
          type: string
          format: uuid
        indosMasterId:
          type: string
          format: uuid
        berthAllocationId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
    BerthAllocationPatchRequestDTO:
      type: object
      properties:
        berthId:
          type: string
          format: uuid
        vesselId:
          type: string
          format: uuid
        startDate:
          type: string
          format: date-time
        endDate:
          type: string
          format: date-time
    AuditLogsResponseDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        tableName:
          type: string
        operation:
          type: string
        recordId:
          type: string
          format: uuid
        oldValues:
          type: string
        newValues:
          type: string
        changedBy:
          type: string
          format: uuid
        changedAt:
          type: string
          format: date-time
