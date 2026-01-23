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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("@/generated/prisma/enums");
var prisma_1 = require("@/lib/prisma");
var bcryptjs_1 = require("bcryptjs");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var nairobi, kiambu, centralStation, kilileshwaStation, ruiruStation, hashedPassword, ig, countyCommander, ocs, inspector, sergeant, constable1, constable2, case1, case2, case3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting database seed...');
                    return [4 /*yield*/, prisma_1.prisma.county.upsert({
                            where: { code: 'NBI' },
                            update: {},
                            create: {
                                name: 'Nairobi',
                                code: 'NBI',
                                region: 'Central',
                            },
                        })];
                case 1:
                    nairobi = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.county.upsert({
                            where: { code: 'KBU' },
                            update: {},
                            create: {
                                name: 'Kiambu',
                                code: 'KBU',
                                region: 'Central',
                            },
                        })];
                case 2:
                    kiambu = _a.sent();
                    console.log('✓ Counties created');
                    return [4 /*yield*/, prisma_1.prisma.station.upsert({
                            where: { code: 'NBI-CENTRAL' },
                            update: {},
                            create: {
                                name: 'Nairobi Central Police Station',
                                code: 'NBI-CENTRAL',
                                countyId: nairobi.id,
                                address: 'University Way, Nairobi',
                                phoneNumber: '+254-20-222222',
                                latitude: -1.286389,
                                longitude: 36.817223,
                            },
                        })];
                case 3:
                    centralStation = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.station.upsert({
                            where: { code: 'NBI-KILIMANI' },
                            update: {},
                            create: {
                                name: 'Kilimani Police Station',
                                code: 'NBI-KILIMANI',
                                countyId: nairobi.id,
                                address: 'Kilimani, Nairobi',
                                phoneNumber: '+254-20-333333',
                                latitude: -1.295,
                                longitude: 36.787,
                            },
                        })];
                case 4:
                    kilileshwaStation = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.station.upsert({
                            where: { code: 'KBU-RUIRU' },
                            update: {},
                            create: {
                                name: 'Ruiru Police Station',
                                code: 'KBU-RUIRU',
                                countyId: kiambu.id,
                                address: 'Ruiru Town, Kiambu',
                                phoneNumber: '+254-20-444444',
                                latitude: -1.150,
                                longitude: 36.961,
                            },
                        })];
                case 5:
                    ruiruStation = _a.sent();
                    console.log('✓ Stations created');
                    return [4 /*yield*/, bcryptjs_1.default.hash('password123', 12)];
                case 6:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'IG-001' },
                            update: {},
                            create: {
                                serviceNumber: 'IG-001',
                                email: 'ig@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'Japheth',
                                lastName: 'Koome',
                                phoneNumber: '+254-700-000001',
                                role: enums_1.UserRole.INSPECTOR_GENERAL,
                                rank: 'Inspector General',
                            },
                        })];
                case 7:
                    ig = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'CC-001' },
                            update: {},
                            create: {
                                serviceNumber: 'CC-001',
                                email: 'cc.nairobi@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'James',
                                lastName: 'Mugera',
                                phoneNumber: '+254-700-000002',
                                role: enums_1.UserRole.COUNTY_COMMANDER,
                                rank: 'County Commander',
                                countyId: nairobi.id,
                            },
                        })];
                case 8:
                    countyCommander = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'OCS-001' },
                            update: {},
                            create: {
                                serviceNumber: 'OCS-001',
                                email: 'ocs.central@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'Peter',
                                lastName: 'Kimani',
                                phoneNumber: '+254-700-000003',
                                role: enums_1.UserRole.OCS,
                                rank: 'Chief Inspector',
                                stationId: centralStation.id,
                            },
                        })];
                case 9:
                    ocs = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'INS-001' },
                            update: {},
                            create: {
                                serviceNumber: 'INS-001',
                                email: 'john.kamau@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'John',
                                lastName: 'Kamau',
                                phoneNumber: '+254-700-000004',
                                role: enums_1.UserRole.INSPECTOR,
                                rank: 'Inspector',
                                stationId: centralStation.id,
                            },
                        })];
                case 10:
                    inspector = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'SGT-001' },
                            update: {},
                            create: {
                                serviceNumber: 'SGT-001',
                                email: 'mary.wanjiku@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'Mary',
                                lastName: 'Wanjiku',
                                phoneNumber: '+254-700-000005',
                                role: enums_1.UserRole.SERGEANT,
                                rank: 'Sergeant',
                                stationId: centralStation.id,
                            },
                        })];
                case 11:
                    sergeant = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'PC-001' },
                            update: {},
                            create: {
                                serviceNumber: 'PC-001',
                                email: 'david.omondi@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'David',
                                lastName: 'Omondi',
                                phoneNumber: '+254-700-000006',
                                role: enums_1.UserRole.CONSTABLE,
                                rank: 'Police Constable',
                                stationId: centralStation.id,
                            },
                        })];
                case 12:
                    constable1 = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.user.upsert({
                            where: { serviceNumber: 'PC-002' },
                            update: {},
                            create: {
                                serviceNumber: 'PC-002',
                                email: 'grace.mwangi@nps.go.ke',
                                password: hashedPassword,
                                firstName: 'Grace',
                                lastName: 'Mwangi',
                                phoneNumber: '+254-700-000007',
                                role: enums_1.UserRole.CONSTABLE,
                                rank: 'Police Constable',
                                stationId: centralStation.id,
                            },
                        })];
                case 13:
                    constable2 = _a.sent();
                    console.log('✓ Users created');
                    return [4 /*yield*/, prisma_1.prisma.case.create({
                            data: {
                                obNumber: 'OB/2024/001567',
                                title: 'Armed Robbery - Westlands Area',
                                description: 'Armed robbery reported at a supermarket on Waiyaki Way. Three suspects armed with firearms stole cash and goods worth approximately KES 500,000.',
                                category: enums_1.CaseCategory.ROBBERY,
                                status: enums_1.CaseStatus.UNDER_INVESTIGATION,
                                priority: enums_1.CasePriority.URGENT,
                                location: 'Waiyaki Way, Westlands',
                                latitude: -1.2636,
                                longitude: 36.8063,
                                incidentDate: new Date('2024-01-20T14:30:00'),
                                reportedById: constable1.id,
                                assignedToId: inspector.id,
                                stationId: centralStation.id,
                            },
                        })];
                case 14:
                    case1 = _a.sent();
                    // Create OB Entry for case1
                    return [4 /*yield*/, prisma_1.prisma.oBEntry.create({
                            data: {
                                caseId: case1.id,
                                entryNumber: 1567,
                                stationId: centralStation.id,
                                officerId: constable1.id,
                                description: 'Armed robbery reported at supermarket. Initial response unit dispatched.',
                            },
                        })];
                case 15:
                    // Create OB Entry for case1
                    _a.sent();
                    // Create suspects for case1
                    return [4 /*yield*/, prisma_1.prisma.suspect.create({
                            data: {
                                caseId: case1.id,
                                firstName: 'Unknown',
                                lastName: 'Suspect 1',
                                description: 'Male, approximately 25-30 years old, wearing a black hoodie',
                                isCustody: false,
                            },
                        })];
                case 16:
                    // Create suspects for case1
                    _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.case.create({
                            data: {
                                obNumber: 'OB/2024/001568',
                                title: 'Traffic Accident - Thika Road',
                                description: 'Multiple vehicle collision on Thika Superhighway near Githurai. Two casualties reported.',
                                category: enums_1.CaseCategory.TRAFFIC,
                                status: enums_1.CaseStatus.REPORTED,
                                priority: enums_1.CasePriority.HIGH,
                                location: 'Thika Road, Githurai',
                                latitude: -1.2167,
                                longitude: 36.8833,
                                incidentDate: new Date('2024-01-21T08:15:00'),
                                reportedById: constable2.id,
                                stationId: centralStation.id,
                            },
                        })];
                case 17:
                    case2 = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.oBEntry.create({
                            data: {
                                caseId: case2.id,
                                entryNumber: 1568,
                                stationId: centralStation.id,
                                officerId: constable2.id,
                                description: 'Traffic accident reported. Ambulance and traffic officers dispatched.',
                            },
                        })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.case.create({
                            data: {
                                obNumber: 'OB/2024/001569',
                                title: 'Domestic Dispute - Kilimani',
                                description: 'Domestic violence reported. Victim has minor injuries.',
                                category: enums_1.CaseCategory.DOMESTIC,
                                status: enums_1.CaseStatus.RESOLVED,
                                priority: enums_1.CasePriority.MEDIUM,
                                location: 'Kilimani Estate',
                                latitude: -1.2950,
                                longitude: 36.7870,
                                incidentDate: new Date('2024-01-19T22:00:00'),
                                reportedById: sergeant.id,
                                assignedToId: sergeant.id,
                                stationId: centralStation.id,
                            },
                        })];
                case 19:
                    case3 = _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.oBEntry.create({
                            data: {
                                caseId: case3.id,
                                entryNumber: 1569,
                                stationId: centralStation.id,
                                officerId: sergeant.id,
                                description: 'Domestic dispute resolved. Parties counseled and separated.',
                            },
                        })];
                case 20:
                    _a.sent();
                    console.log('✓ Sample cases created');
                    // Create Traffic Offenses
                    return [4 /*yield*/, prisma_1.prisma.trafficOffense.create({
                            data: {
                                offenseNumber: 'TO/2024/0001',
                                officerId: constable1.id,
                                driverName: 'Patrick Mwangi',
                                driverIdNumber: '12345678',
                                driverLicense: 'DL123456',
                                vehicleReg: 'KCA 123A',
                                offenseType: 'Speeding',
                                location: 'Uhuru Highway',
                                fineAmount: 5000,
                                offenseDate: new Date('2024-01-21T10:30:00'),
                            },
                        })];
                case 21:
                    // Create Traffic Offenses
                    _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.trafficOffense.create({
                            data: {
                                offenseNumber: 'TO/2024/0002',
                                officerId: constable2.id,
                                driverName: 'Jane Mutua',
                                vehicleReg: 'KBZ 456B',
                                offenseType: 'Illegal Parking',
                                location: 'City Center',
                                fineAmount: 2000,
                                isPaid: true,
                                offenseDate: new Date('2024-01-20T15:00:00'),
                            },
                        })];
                case 22:
                    _a.sent();
                    console.log('✓ Traffic offenses created');
                    // Create Activity Logs
                    return [4 /*yield*/, prisma_1.prisma.activityLog.create({
                            data: {
                                userId: inspector.id,
                                action: 'CASE_RESOLVED',
                                entityType: 'CASE',
                                entityId: case3.id,
                                metadata: {
                                    obNumber: case3.obNumber,
                                    resolution: 'Parties counseled',
                                },
                            },
                        })];
                case 23:
                    // Create Activity Logs
                    _a.sent();
                    return [4 /*yield*/, prisma_1.prisma.activityLog.create({
                            data: {
                                userId: constable1.id,
                                action: 'CREATE_CASE',
                                entityType: 'CASE',
                                entityId: case1.id,
                                metadata: {
                                    obNumber: case1.obNumber,
                                },
                            },
                        })];
                case 24:
                    _a.sent();
                    console.log('✓ Activity logs created');
                    // Create Notifications
                    return [4 /*yield*/, prisma_1.prisma.notification.create({
                            data: {
                                userId: inspector.id,
                                title: 'New Case Assigned',
                                message: "Case ".concat(case1.obNumber, " has been assigned to you"),
                                type: 'CASE_ASSIGNMENT',
                                metadata: {
                                    caseId: case1.id,
                                    obNumber: case1.obNumber,
                                },
                            },
                        })];
                case 25:
                    // Create Notifications
                    _a.sent();
                    console.log('✓ Notifications created');
                    console.log('\n✅ Seeding completed successfully!');
                    console.log('\n📝 Test Accounts:');
                    console.log('────────────────────────────────────────');
                    console.log('Inspector General:');
                    console.log('  Service Number: IG-001');
                    console.log('  Email: ig@nps.go.ke');
                    console.log('  Password: password123');
                    console.log('\nCounty Commander (Nairobi):');
                    console.log('  Service Number: CC-001');
                    console.log('  Email: cc.nairobi@nps.go.ke');
                    console.log('  Password: password123');
                    console.log('\nOCS (Central Station):');
                    console.log('  Service Number: OCS-001');
                    console.log('  Email: ocs.central@nps.go.ke');
                    console.log('  Password: password123');
                    console.log('\nInspector:');
                    console.log('  Service Number: INS-001');
                    console.log('  Email: john.kamau@nps.go.ke');
                    console.log('  Password: password123');
                    console.log('\nConstable:');
                    console.log('  Service Number: PC-001');
                    console.log('  Email: david.omondi@nps.go.ke');
                    console.log('  Password: password123');
                    console.log('────────────────────────────────────────\n');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
