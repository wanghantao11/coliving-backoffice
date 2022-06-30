"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const _1 = require(".");
const address_controller_1 = require("../application/controllers/address.controller");
const admin_controller_1 = require("../application/controllers/admin.controller");
const admins_controller_1 = require("../application/controllers/admins.controller");
const apartment_controller_1 = require("../application/controllers/apartment.controller");
const application_controller_1 = require("../application/controllers/application.controller");
const client_controller_1 = require("../application/controllers/client.controller");
const contract_controller_1 = require("../application/controllers/contract.controller");
const contractTemplates_controller_1 = require("../application/controllers/contractTemplates.controller");
const emergencyContacts_controller_1 = require("../application/controllers/emergencyContacts.controller");
const getstreamChat_controller_1 = require("../application/controllers/getstreamChat.controller");
const incidentReport_controller_1 = require("../application/controllers/incidentReport.controller");
const interests_controller_1 = require("../application/controllers/interests.controller");
const job_controller_1 = require("../application/controllers/job.controller");
const label_controller_1 = require("../application/controllers/label.controller");
const member_controller_1 = require("../application/controllers/member.controller");
const members_controller_1 = require("../application/controllers/members.controller");
const memberTags_controller_1 = require("../application/controllers/memberTags.controller");
const offer_controller_1 = require("../application/controllers/offer.controller");
const offerQueue_controller_1 = require("../application/controllers/offerQueue.controller");
const project_controller_1 = require("../application/controllers/project.controller");
const projectFacade_controller_1 = require("../application/controllers/projectFacade.controller");
const projectFacadeBilling_controller_1 = require("../application/controllers/projectFacadeBilling.controller");
const projectGallery_controller_1 = require("../application/controllers/projectGallery.controller");
const projects_controller_1 = require("../application/controllers/projects.controller");
const role_controller_1 = require("../application/controllers/role.controller");
const room_controller_1 = require("../application/controllers/room.controller");
const roomAndTenants_controller_1 = require("../application/controllers/roomAndTenants.controller");
const rooms_controller_1 = require("../application/controllers/rooms.controller");
const statistics_controller_1 = require("../application/controllers/statistics.controller");
const tenant_controller_1 = require("../application/controllers/tenant.controller");
const tenants_controller_1 = require("../application/controllers/tenants.controller");
const user_controller_1 = require("../application/controllers/user.controller");
const userProfiles_controller_1 = require("../application/controllers/userProfiles.controller");
const userPreferences_controller_1 = require("../application/controllers/userPreferences.controller");
const webhook_controller_1 = require("../application/controllers/webhook.controller");
const payment_controller_1 = require("../application/controllers/payment.controller");
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(address_controller_1.default)
    .whenTargetNamed('Address_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(admin_controller_1.default)
    .whenTargetNamed('Admin_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(admins_controller_1.default)
    .whenTargetNamed('Admins_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(apartment_controller_1.default)
    .whenTargetNamed('Apartment_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(application_controller_1.default)
    .whenTargetNamed('Application_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(client_controller_1.default)
    .whenTargetNamed('Client_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(contract_controller_1.default)
    .whenTargetNamed('Contract_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(contractTemplates_controller_1.default)
    .whenTargetNamed('ContractTemplates_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(emergencyContacts_controller_1.default)
    .whenTargetNamed('EmergencyContacts_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(getstreamChat_controller_1.default)
    .whenTargetNamed('Getstream_Chat_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(incidentReport_controller_1.default)
    .whenTargetNamed('Incident_Report_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(interests_controller_1.default)
    .whenTargetNamed('Interests_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(job_controller_1.default)
    .whenTargetNamed('Job_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(label_controller_1.default)
    .whenTargetNamed('Label_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(member_controller_1.default)
    .whenTargetNamed('Member_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(members_controller_1.default)
    .whenTargetNamed('Members_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(memberTags_controller_1.default)
    .whenTargetNamed('MemberTags_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(offer_controller_1.default)
    .whenTargetNamed('Offer_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(offerQueue_controller_1.default)
    .whenTargetNamed('Offer_Queue_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(project_controller_1.default)
    .whenTargetNamed('Project_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(projectFacade_controller_1.default)
    .whenTargetNamed('Project_Facade_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(projectFacadeBilling_controller_1.default)
    .whenTargetNamed('Project_Facade_Billing_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(projectGallery_controller_1.default)
    .whenTargetNamed('Project_Gallery_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(projects_controller_1.default)
    .whenTargetNamed('Projects_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(role_controller_1.default)
    .whenTargetNamed('Role_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(room_controller_1.default)
    .whenTargetNamed('Room_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(roomAndTenants_controller_1.default)
    .whenTargetNamed('Room_And_Tenants_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(rooms_controller_1.default)
    .whenTargetNamed('Rooms_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(statistics_controller_1.default)
    .whenTargetNamed('Statistics_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(tenant_controller_1.default)
    .whenTargetNamed('Tenant_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(tenants_controller_1.default)
    .whenTargetNamed('Tenants_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(user_controller_1.default)
    .whenTargetNamed('User_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(userPreferences_controller_1.default)
    .whenTargetNamed('UserPreferences_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(userProfiles_controller_1.default)
    .whenTargetNamed('UserProfiles_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(webhook_controller_1.default)
    .whenTargetNamed('Webhook_Controller');
_1.container
    .bind(inversify_express_utils_1.TYPE.Controller)
    .to(payment_controller_1.default)
    .whenTargetNamed('Payment_Controller');
//# sourceMappingURL=controllers.js.map