"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const contract_1 = require("../../../../src/infrastructure/utils/contract");
const constants_1 = require("../../../../src/infrastructure/constants");
const lodash_1 = require("lodash");
describe('testing the contract function parseOneflowResponse', () => {
    it('should parse the response properly', () => {
        const input = {
            callback_id: 'callback_id',
            signature: 'signature',
            agreement: {},
            agreement_id: 1,
            account: {},
            events: [
                { type: 2 },
            ],
        };
        expect.assertions(1);
        return contract_1.parseOneflowResponse(input)
            .then(data => expect(data).toEqual({ externalId: 1, status: constants_1.CONTRACT_STATUS.SIGNED, participantId: false }));
    });
    it('should reject with NO_CONTENT if not mapped', () => {
        const input = {
            callback_id: 'callback_id',
            signature: 'signature',
            agreement: {},
            agreement_id: 1,
            account: {},
            events: [
                { type: 3 },
            ],
        };
        expect.assertions(1);
        return contract_1.parseOneflowResponse(input)
            .catch(({ message }) => expect(message).toBe('NO_CONTENT'));
    });
});
describe('testing the contract function formatContract', () => {
    it('should format the contract data properly', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [{
                iduser: 'test',
                first_name: 'firstname',
                last_name: 'lastname',
                email: 'test@test.test',
                phone: '12345678',
                move_in_date: new Date(),
                project_name: 'test',
                facade_id: 1,
                landlord_name: 'test',
                landlord_email: 'test',
                landlord_org_no: 'test',
                landlord_street: 'test',
                landlord_zip: 'test',
                landlord_post_area: 'test',
                property_unit_designation: 'test',
                coliving_hub: 'test',
                post_area: 'test',
                bankgiro_no: 'test',
                deposit: 1,
                deposit_refund_weeks: 1,
                rent_yearly_increase_rate: 1,
                rent_yearly_increase_date: new Date('2020-01-01'),
                rent_day_of_month: 25,
                service_fee_day_of_month: 25,
                extra_fields: {},
                room_id: 1,
                number: '1234',
                people_per_room: 1,
                size: 20,
                shared_area_size: 50,
                floor_no: '1',
                street: 'test',
                zip: '1111',
                rent: 4000,
                service_fee: 3000,
                collection_id: 1,
            }];
        const templates = [{ name: 'single', id: 1, template_group_id: 1 }, { name: 'double', id: 2, template_group_id: 1 }];
        expect.assertions(1);
        return contract_1.formatContract(input, templates).then(({ data }) => {
            const unit_floor = lodash_1.find(data, ['value.external_key', 'unit_floor']).value.value;
            expect(unit_floor).toEqual('1');
        });
    }));
    it('should return empty string is field is null', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [{
                iduser: 'test',
                first_name: 'firstname',
                last_name: 'lastname',
                email: 'test@test.test',
                phone: '12345678',
                move_in_date: new Date(),
                project_name: 'test',
                facade_id: 1,
                landlord_name: 'test',
                landlord_email: 'test',
                landlord_org_no: 'test',
                landlord_street: 'test',
                landlord_zip: 'test',
                landlord_post_area: 'test',
                property_unit_designation: 'test',
                coliving_hub: 'test',
                post_area: 'test',
                bankgiro_no: 'test',
                deposit: 1,
                deposit_refund_weeks: 1,
                rent_yearly_increase_rate: 1,
                rent_yearly_increase_date: new Date('2020-01-01'),
                rent_day_of_month: 25,
                service_fee_day_of_month: 25,
                extra_fields: {},
                room_id: 1,
                number: '1234',
                people_per_room: 1,
                size: 20,
                shared_area_size: 50,
                floor_no: null,
                street: 'test',
                zip: '1111',
                rent: 4000,
                service_fee: 3000,
                collection_id: 1,
            }];
        const templates = [{ name: 'single', id: 1, template_group_id: 1 }, { name: 'double', id: 2, template_group_id: 1 }];
        expect.assertions(1);
        return contract_1.formatContract(input, templates).then(({ data }) => {
            const unit_floor = lodash_1.find(data, ['value.external_key', 'unit_floor']).value.value;
            expect(unit_floor).toEqual('');
        });
    }));
    it('should throw error when no source_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [{
                iduser: 'test',
                first_name: 'firstname',
                last_name: 'lastname',
                email: 'test@test.test',
                phone: '12345678',
                move_in_date: new Date(),
                project_name: 'test',
                facade_id: 1,
                landlord_name: 'test',
                landlord_email: 'test',
                landlord_org_no: 'test',
                landlord_street: 'test',
                landlord_zip: 'test',
                landlord_post_area: 'test',
                property_unit_designation: 'test',
                coliving_hub: 'test',
                post_area: 'test',
                bankgiro_no: 'test',
                deposit: 1,
                deposit_refund_weeks: 1,
                rent_yearly_increase_rate: 1,
                rent_yearly_increase_date: new Date('2020-01-01'),
                rent_day_of_month: 25,
                service_fee_day_of_month: 25,
                extra_fields: { move_in_date: '2020-01-01' },
                room_id: 1,
                number: '1234',
                people_per_room: 1,
                size: 20,
                shared_area_size: 50,
                floor_no: null,
                street: 'test',
                zip: '1111',
                rent: 4000,
                service_fee: 3000,
                collection_id: 1,
            }];
        const templates = [];
        return contract_1.formatContract(input, templates).catch(({ message }) => expect(message).toBe('NOT_ALLOWED'));
    }));
});
describe('testing the contract function checkIsContractDataReady', () => {
    it('should return true if all contract data is filled', () => {
        const input = {
            iduser: 'string',
            first_name: 'string',
            last_name: 'string',
            email: 'string',
            phone: '12345678',
            project_move_in_date: new Date(),
            // projectFacade
            project_name: 'string',
            facade_id: 1,
            landlord_name: 'string',
            landlord_email: 'string',
            landlord_org_no: 'string',
            landlord_street: 'string',
            landlord_zip: 'string',
            landlord_post_area: 'string',
            property_unit_designation: 'string',
            coliving_hub: 'string',
            post_area: 'string',
            // projectFacadeBilling
            bankgiro_no: 'string',
            deposit: 1,
            deposit_refund_weeks: 1,
            rent_yearly_increase_rate: 1,
            rent_yearly_increase_date: new Date(),
            rent_day_of_month: 1,
            service_fee_day_of_month: 1,
            // contractTemplates
            extra_fields: { move_in_date: '2020-01-01' },
            // room
            room_id: 1,
            number: 'string',
            people_per_room: 1,
            size: 1,
            shared_area_size: 1,
            floor_no: 'string',
            street: 'string',
            zip: 'string',
            rent: 1,
            service_fee: 1,
            // collection
            collection_id: 1,
            // common
            move_in_date: null,
        };
        expect.assertions(1);
        return contract_1.checkIsContractDataReady(input)
            .then(data => expect(data).toEqual(true));
    });
    it('should return false if any field is not filled', () => {
        const input = {
            iduser: 'string',
            first_name: 'string',
            last_name: 'string',
            email: 'string',
            phone: '12345678',
            // projectFacade
            project_move_in_date: new Date(),
            project_name: 'string',
            facade_id: 1,
            landlord_name: 'string',
            landlord_email: 'string',
            landlord_org_no: 'string',
            landlord_street: 'string',
            landlord_zip: 'string',
            landlord_post_area: 'string',
            property_unit_designation: 'string',
            coliving_hub: 'string',
            post_area: 'string',
            // projectFacadeBilling
            bankgiro_no: 'string',
            deposit: 1,
            deposit_refund_weeks: 1,
            rent_yearly_increase_rate: 1,
            rent_yearly_increase_date: new Date(),
            rent_day_of_month: 1,
            service_fee_day_of_month: 1,
            // contractTemplates
            extra_fields: null,
            // room
            room_id: 1,
            number: 'string',
            people_per_room: 1,
            size: 1,
            shared_area_size: 1,
            floor_no: 'string',
            street: 'string',
            zip: 'string',
            rent: 1,
            service_fee: 1,
            // collection
            collection_id: 1,
            // common
            move_in_date: null,
        };
        expect.assertions(1);
        return contract_1.checkIsContractDataReady(input)
            .then(data => expect(data).toEqual(false));
    });
});
//# sourceMappingURL=contract.test.js.map