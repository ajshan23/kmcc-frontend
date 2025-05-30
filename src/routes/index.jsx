import { lazy } from "react";
import { Navigate } from "react-router-dom";

// auth
const Login = lazy(() => import("@/app/(other)/auth/login/page"));
const Register = lazy(() => import("@/app/(other)/auth/register/page"));
const Logout = lazy(() => import("@/app/(other)/auth/logout/page"));
const ForgotPassword = lazy(() =>
  import("@/app/(other)/auth/forgot-pass/page")
);
const LockScreen = lazy(() => import("@/app/(other)/auth/lock-screen/page"));

// dashboard
const Dashboard = lazy(() => import("@/app/(admin)/dashboard/page"));

//usrrs
const Table = lazy(() => import("@/app/(admin)/newItems/Table"));
const ProfileView = lazy(() => import("@/app/(admin)/newItems/ProfileView"));
const UserEdit = lazy(() => import("@/app/(admin)/newItems/UserEdit"));

//banner
const Banner = lazy(() => import("@/app/(admin)/banner/Banner"));
const Test = lazy(() => import("@/app/(admin)/test/Test"));
const BannerUpdate = lazy(() =>
  import("@/app/(admin)/banner/Components/BannerUpdate")
);
//NotificationList
const NotificationList = lazy(() =>
  import("@/app/(admin)/notification/NotificationList")
);
//SubWingList

const SubWingList = lazy(() => import("@/app/(admin)/subwing/SubWingList"));
const SubWingForm = lazy(() => import("@/app/(admin)/subwing/SubWingForm"));

//TravelerList
const TravelerList = lazy(() => import("@/app/(admin)/traveler/TravelerList"));

const SubWingDetails = lazy(() =>
  import("@/app/(admin)/subwing/SubWingDetails")
);

//event

const Event = lazy(() => import("@/app/(admin)/events/Event"));
const EventCreate = lazy(() =>
  import("@/app/(admin)/events/Components/EventCreate")
);

const BookList = lazy(() => import("@/app/(admin)/books/BookList"));
const BookForm = lazy(() => import("@/app/(admin)/books/BookForm"));
const BookDetails = lazy(() => import("@/app/(admin)/books/BookDetails"));

//service

const Service = lazy(() => import("@/app/(admin)/service/Service"));
const ServiceCreate = lazy(() =>
  import("@/app/(admin)/service/Components/ServiceCreate")
);

//jobs
const Job = lazy(() => import("@/app/(admin)/jobs/Job"));
const JobCreate = lazy(() => import("@/app/(admin)/jobs/Components/JobCreate"));
const JobApplications = lazy(() =>
  import("@/app/(admin)/jobs/Components/JobApplications")
);

//news

const News = lazy(() => import("@/app/(admin)/news/News"));
const NewsCreate = lazy(() =>
  import("@/app/(admin)/news/Components/NewsCreate")
);
//membership
const Membership = lazy(() =>
  import("@/app/(admin)/membership/ViewMembership")
);
const AddMembership = lazy(() =>
  import("@/app/(admin)/membership/AddMembership")
);
//exlusive members
const ExclusiveMembers = lazy(() =>
  import("@/app/(admin)/exclusiveMemberList/ExclusiveMembersList")
);
const ExclusiveMembersForm = lazy(() =>
  import("@/app/(admin)/exclusiveMemberList/Components/ExclusiveMemberForm")
);
//airport
const Airport = lazy(() => import("@/app/(admin)/airport/Airport"));
const AirportCreate = lazy(() =>
  import("@/app/(admin)/airport/Components/AirportCreate")
);

//survey
const Survey = lazy(() => import("@/app/(admin)/survey/Survey"));
const SurveyCreate = lazy(() =>
  import("@/app/(admin)/survey/Components/SurveyCreate")
);
const SurveyAnswers = lazy(() =>
  import("@/app/(admin)/survey/Components/SurveyAnswers")
);
//committee
const CommitteeList = lazy(() =>
  import("@/app/(admin)/committee/CommitteeList")
);
const CommitteeForm = lazy(() =>
  import("@/app/(admin)/committee/CommitteeForm")
);
const CommitteeDetails = lazy(() =>
  import("@/app/(admin)/committee/CommitteeDetails")
);
const MemberEditForm = lazy(() =>
  import("@/app/(admin)/committee/MemberEditForm")
);

//investment longterm
const InvestmentList = lazy(() =>
  import("@/app/(admin)/investments/InvestmentList")
);
const NewInvestmentForm = lazy(() =>
  import("@/app/(admin)/investments/NewInvestmentForm")
);
const InvestmentDetails = lazy(() =>
  import("@/app/(admin)/investments/InvestmentDetails")
);
const AddDepositForm = lazy(() =>
  import("@/app/(admin)/investments/AddDepositForm")
);
const AddProfitForm = lazy(() =>
  import("@/app/(admin)/investments/AddProfitForm")
);
const AddProfitPayoutForm = lazy(() =>
  import("@/app/(admin)/investments/AddProfitPayoutForm")
);
//questions
const AddQuestions = lazy(() =>
  import("@/app/(admin)/survey/Components/AddQuestions")
);
const UpdateQuestion = lazy(() =>
  import("@/app/(admin)/survey/Components/UpdateQuestion")
);
const ViewQuestions = lazy(() =>
  import("@/app/(admin)/survey/Components/ViewQuestions")
);

//apps
const Calendar = lazy(() => import("@/app/(admin)/apps/calendar/page"));
const KanbanBoard = lazy(() => import("@/app/(admin)/apps/kanban/page"));

// pages
const ProfilePages = lazy(() => import("@/app/(admin)/pages/profile/page"));
const InvoiceReport = lazy(() =>
  import("@/app/(admin)/apps/invoices/report/page")
);
const InvoiceDetail = lazy(() =>
  import("@/app/(admin)/apps/invoices/[invoiceId]/page")
);
const FAQPages = lazy(() => import("@/app/(admin)/pages/faqs/page"));
const PricingPages = lazy(() => import("@/app/(admin)/pages/pricing/page"));
const MaintenancePages = lazy(() => import("@/app/(other)/maintenance/page"));
const StarterPages = lazy(() => import("@/app/(admin)/pages/starter/page"));
const ContactListPages = lazy(() =>
  import("@/app/(admin)/pages/contacts/page")
);
const TimelinePages = lazy(() => import("@/app/(admin)/pages/timeline/page"));

// base ui
const Accordions = lazy(() => import("@/app/(admin)/ui/accordions/page"));
const Alerts = lazy(() => import("@/app/(admin)/ui/alerts/page"));
const Avatars = lazy(() => import("@/app/(admin)/ui/avatars/page"));
const Badges = lazy(() => import("@/app/(admin)/ui/badges/page"));
const Breadcrumb = lazy(() => import("@/app/(admin)/ui/breadcrumb/page"));
const Buttons = lazy(() => import("@/app/(admin)/ui/buttons/page"));
const ButtonGroups = lazy(() => import("@/app/(admin)/ui/button-group/page"));
const Cards = lazy(() => import("@/app/(admin)/ui/cards/page"));
const Carousel = lazy(() => import("@/app/(admin)/ui/carousel/page"));
const Collapse = lazy(() => import("@/app/(admin)/ui/collapse/page"));
const Dropdowns = lazy(() => import("@/app/(admin)/ui/dropdowns/page"));
const EmbedVideo = lazy(() => import("@/app/(admin)/ui/embed-video/page"));
const Grid = lazy(() => import("@/app/(admin)/ui/grid/page"));
const Links = lazy(() => import("@/app/(admin)/ui/links/page"));
const ListGroup = lazy(() => import("@/app/(admin)/ui/list-group/page"));
const Modals = lazy(() => import("@/app/(admin)/ui/modals/page"));
const Notifications = lazy(() => import("@/app/(admin)/ui/toasts/page"));
const Offcanvas = lazy(() => import("@/app/(admin)/ui/offcanvas/page"));
const Placeholders = lazy(() => import("@/app/(admin)/ui/placeholders/page"));
const Pagination = lazy(() => import("@/app/(admin)/ui/pagination/page"));
const Popovers = lazy(() => import("@/app/(admin)/ui/popovers/page"));
const Progress = lazy(() => import("@/app/(admin)/ui/progress/page"));
const Spinners = lazy(() => import("@/app/(admin)/ui/spinners/page"));
const Tabs = lazy(() => import("@/app/(admin)/ui/tabs/page"));
const Tooltips = lazy(() => import("@/app/(admin)/ui/tooltips/page"));
const Typography = lazy(() => import("@/app/(admin)/ui/typography/page"));
const Utilities = lazy(() => import("@/app/(admin)/ui/utilities/page"));
const CloseButtons = lazy(() => import("@/app/(admin)/ui/close-buttons/page"));
const Navbars = lazy(() => import("@/app/(admin)/ui/navbar/page"));

// extended ui
const Portlets = lazy(() => import("@/app/(admin)/extended/portlets/page"));
const RangeSlider = lazy(() =>
  import("@/app/(admin)/extended/range-slider/page")
);
const Scrollbar = lazy(() => import("@/app/(admin)/extended/scrollbar/page"));

// icons
const RemixIcons = lazy(() => import("@/app/(admin)/icons/remix/page"));
const BootstrapIcons = lazy(() => import("@/app/(admin)/icons/bs/page"));
const MaterialIcons = lazy(() => import("@/app/(admin)/icons/mdi/page"));
const LucideIcons = lazy(() => import("@/app/(admin)/icons/lucide/page"));

// charts
const ApexCharts = lazy(() => import("@/app/(admin)/charts/apex/page"));
const SparklineCharts = lazy(() =>
  import("@/app/(admin)/charts/sparkline/page")
);
const ChartJs = lazy(() => import("@/app/(admin)/charts/chartjs/page"));

// forms
const BasicElements = lazy(() => import("@/app/(admin)/forms/basic/page"));
const FormAdvanced = lazy(() => import("@/app/(admin)/forms/advanced/page"));
const Validation = lazy(() => import("@/app/(admin)/forms/validation/page"));
const Wizard = lazy(() => import("@/app/(admin)/forms/wizard/page"));
const FileUploads = lazy(() => import("@/app/(admin)/forms/file-uploads/page"));
const Editors = lazy(() => import("@/app/(admin)/forms/editors/page"));
const ImageCrop = lazy(() => import("@/app/(admin)/forms/image-crop/page"));
const Editable = lazy(() => import("@/app/(admin)/forms/editable/page"));

//gold-program
const GoldProgramsList = lazy(() =>
  import("@/app/(admin)/goldproject/GoldProgramsList")
);
const GoldProgramForm = lazy(() =>
  import("@/app/(admin)/goldproject/GoldProgramForm")
);
const GoldProgramDetails = lazy(() =>
  import("@/app/(admin)/goldproject/GoldProgramDetails")
);
const ProgramLotsList = lazy(() =>
  import("@/app/(admin)/goldproject/ProgramLotsList")
);
const RecordPayment = lazy(() =>
  import("@/app/(admin)/goldproject/RecordPayment")
);
const AssignLotForm = lazy(() =>
  import("@/app/(admin)/goldproject/AssignLotForm")
);
const WinnersManagement = lazy(() =>
  import("@/app/(admin)/goldproject/WinnersManagement")
);

// tables
const BasicTables = lazy(() => import("@/app/(admin)/tables/basic/page"));
const DataTables = lazy(() => import("@/app/(admin)/tables/data-table/page"));
const ResponsiveTable = lazy(() =>
  import("@/app/(admin)/tables/responsive-table/page")
);

// maps
const GoogleMaps = lazy(() => import("@/app/(admin)/maps/google/page"));
const VectorMaps = lazy(() => import("@/app/(admin)/maps/vector/page"));

// error
const Error404 = lazy(() =>
  import("@/app/(other)/(error-pages)/error-404/page")
);
const Error404Alt = lazy(() =>
  import("@/app/(admin)/pages/error-404-alt/page")
);
const Error500 = lazy(() =>
  import("@/app/(other)/(error-pages)/error-500/page")
);
const initialRoutes = [
  {
    path: "/",
    name: "root",
    element: <Navigate to="/dashboard" />,
  },
];

// dashboards
const generalRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
  },
];
const appsRoutes = [
  {
    path: "/apps/calendar",
    name: "Calendar",
    element: <Calendar />,
  },
  {
    path: "/apps/kanban",
    name: "Kanban",
    element: <KanbanBoard />,
  },
  {
    path: "/apps/invoices/report",
    name: "Invoice",
    element: <InvoiceReport />,
  },
  {
    name: "Invoice",
    path: "/apps/invoices/:invoiceId",
    element: <InvoiceDetail />,
  },
];

// pages
const customPagesRoutes = [
  {
    path: "/pages/profile",
    name: "Profile",
    element: <ProfilePages />,
  },
  {
    path: "/pages/faqs",
    name: "FAQ",
    element: <FAQPages />,
  },
  {
    path: "/pages/pricing",
    name: "Pricing",
    element: <PricingPages />,
  },
  {
    path: "/pages/starter",
    name: "Starter Page",
    element: <StarterPages />,
  },
  {
    path: "/pages/contacts",
    name: "Contact List",
    element: <ContactListPages />,
  },
  {
    path: "/pages/timeline",
    name: "Timeline",
    element: <TimelinePages />,
  },
  {
    path: "pages/error-404-alt",
    name: "Error - 404-alt",
    element: <Error404Alt />,
  },
];

// ui
const uiRoutes = [
  {
    path: "/ui/accordions",
    name: "Accordions",
    element: <Accordions />,
  },
  {
    path: "/ui/alerts",
    name: "Alerts",
    element: <Alerts />,
  },
  {
    path: "/ui/avatars",
    name: "Avatars",
    element: <Avatars />,
  },
  {
    path: "/ui/badges",
    name: "Badges",
    element: <Badges />,
  },
  {
    path: "/ui/breadcrumb",
    name: "Breadcrumb",
    element: <Breadcrumb />,
  },
  {
    path: "/ui/buttons",
    name: "Buttons",
    element: <Buttons />,
  },
  {
    path: "/ui/cards",
    name: "Cards",
    element: <Cards />,
  },
  {
    path: "/ui/carousel",
    name: "Carousel",
    element: <Carousel />,
  },
  {
    path: "/ui/collapse",
    name: "Collapse",
    element: <Collapse />,
  },
  {
    path: "/ui/close-buttons",
    name: "Close Buttons",
    element: <CloseButtons />,
  },
  {
    path: "/ui/button-group",
    name: "Button Group",
    element: <ButtonGroups />,
  },
  {
    path: "/ui/dropdowns",
    name: "Dropdowns",
    element: <Dropdowns />,
  },
  {
    path: "/ui/embed-video",
    name: "Embed Video",
    element: <EmbedVideo />,
  },
  {
    path: "/ui/grid",
    name: "Grid",
    element: <Grid />,
  },
  {
    path: "/ui/links",
    name: "Links",
    element: <Links />,
  },
  {
    path: "/ui/list-group",
    name: "List Group",
    element: <ListGroup />,
  },
  {
    path: "/ui/navbar",
    name: "NavBars",
    element: <Navbars />,
  },
  {
    path: "/ui/modals",
    name: "Modals",
    element: <Modals />,
  },
  {
    path: "/ui/toasts",
    name: "Toasts",
    element: <Notifications />,
  },
  {
    path: "/ui/offcanvas",
    name: "Offcanvas",
    element: <Offcanvas />,
  },
  {
    path: "/ui/placeholders",
    name: "Placeholders",
    element: <Placeholders />,
  },
  {
    path: "/ui/pagination",
    name: "Pagination",
    element: <Pagination />,
  },
  {
    path: "/ui/popovers",
    name: "Popovers",
    element: <Popovers />,
  },
  {
    path: "/ui/progress",
    name: "Progress",
    element: <Progress />,
  },
  {
    path: "/ui/spinners",
    name: "Spinners",
    element: <Spinners />,
  },
  {
    path: "/ui/tabs",
    name: "Tabs",
    element: <Tabs />,
  },
  {
    path: "/ui/tooltips",
    name: "Tooltips",
    element: <Tooltips />,
  },
  {
    path: "/ui/typography",
    name: "Typography",
    element: <Typography />,
  },
  {
    path: "/ui/utilities",
    name: "Utilities",
    element: <Utilities />,
  },
];
const iconsRoutes = [
  {
    path: "/icons/lucide",
    name: "Remix Icons",
    element: <LucideIcons />,
  },
  {
    path: "/icons/remix",
    name: "Remix Icons",
    element: <RemixIcons />,
  },
  {
    path: "/icons/bs",
    name: "Bootstrap Icons",
    element: <BootstrapIcons />,
  },
  {
    path: "/icons/mdi",
    name: "Material Icons",
    element: <MaterialIcons />,
  },
];
const extendedRoutes = [
  {
    path: "/extended/portlets",
    name: "Portlets",
    element: <Portlets />,
  },
  {
    path: "/extended/range-slider",
    name: "Range Slider",
    element: <RangeSlider />,
  },
  {
    path: "/extended/scrollbar",
    name: "Scrollbar",
    element: <Scrollbar />,
  },
];
const chartsRoutes = [
  {
    path: "/charts/apex",
    name: "Apex Charts",
    element: <ApexCharts />,
  },
  {
    path: "/charts/chartjs",
    name: "ChartJS",
    element: <ChartJs />,
  },
  {
    path: "/charts/sparkline",
    name: "Sparkline Charts",
    element: <SparklineCharts />,
  },
];
const formsRoutes = [
  {
    path: "/forms/basic",
    name: "Basic Elements",
    element: <BasicElements />,
  },
  {
    path: "/forms/advanced",
    name: "Form Advanced",
    element: <FormAdvanced />,
  },
  {
    path: "/forms/validation",
    name: "Validation",
    element: <Validation />,
  },
  {
    path: "/forms/wizard",
    name: "Wizard",
    element: <Wizard />,
  },
  {
    path: "/forms/file-uploads",
    name: "File Uploads",
    element: <FileUploads />,
  },
  {
    path: "/forms/editors",
    name: "Editors",
    element: <Editors />,
  },
  {
    path: "/forms/image-crop",
    name: "Image Crop",
    element: <ImageCrop />,
  },
  {
    path: "/forms/editable",
    name: "Editable",
    element: <Editable />,
  },
];
const tablesRoutes = [
  {
    path: "/tables/basic",
    name: "Basic Tables",
    element: <BasicTables />,
  },
  {
    path: "/tables/data-table",
    name: "Data Tables",
    element: <DataTables />,
  },
  {
    path: "/tables/responsive-table",
    name: "Responsive Tables",
    element: <ResponsiveTable />,
  },
];
const mapsRoutes = [
  {
    path: "/maps/google",
    name: "Google Maps",
    element: <GoogleMaps />,
  },
  {
    path: "/maps/vector",
    name: "Vector Maps",
    element: <VectorMaps />,
  },
];

const userRoutes = [
  {
    path: "/users/table",
    name: "users",
    element: <Table />,
  },
  {
    path: "/users/:id",
    name: "user",
    element: <ProfileView />,
  },
  {
    path: "/users/:id/edit",
    name: "user edit",
    element: <UserEdit />,
  },
];
const bannerRoutes = [
  {
    path: "/banner/update",
    name: "banner",
    element: <BannerUpdate />,
  },
  {
    path: "/banner",
    name: "banner",
    element: <Banner />,
  },
];

const eventRoutes = [
  {
    path: "/event/new",
    name: "banner",
    element: <EventCreate />,
  },
  {
    path: "/event/edit/:id",
    name: "banner",
    element: <EventCreate />,
  },
  {
    path: "/event",
    name: "event",
    element: <Event />,
  },
];

const serviceRoutes = [
  {
    path: "/service/new",
    name: "service",
    element: <ServiceCreate />,
  },
  {
    path: "/service",
    name: "service",
    element: <Service />,
  },
  {
    path: "/service/edit/:id",
    name: "service",
    element: <ServiceCreate />,
  },
];

const jobRoutes = [
  {
    path: "/job/new",
    name: "job",
    element: <JobCreate />,
  },
  {
    path: "/job",
    name: "job",
    element: <Job />,
  },
  {
    path: "/job/edit/:id",
    name: "job",
    element: <JobCreate />,
  },
  {
    path: "/job/applications/:jobId",
    name: "job",
    element: <JobApplications />,
  },
];

const newsRoutes = [
  {
    path: "/news/new",
    name: "news",
    element: <NewsCreate />,
  },
  {
    path: "/news",
    name: "news",
    element: <News />,
  },
  {
    path: "/news/edit/:id",
    name: "news",
    element: <NewsCreate />,
  },
];

const airportRoutes = [
  {
    path: "/airport/new",
    name: "airport",
    element: <AirportCreate />,
  },
  {
    path: "/airport",
    name: "airport",
    element: <Airport />,
  },
  {
    path: "/airport/edit/:id",
    name: "airport",
    element: <AirportCreate />,
  },
];

const surveyRoutes = [
  {
    path: "/survey/new",
    name: "survey",
    element: <SurveyCreate />,
  },
  {
    path: "/questions",
    name: "questions view",
    element: <ViewQuestions />, //test
  },
  {
    path: "/questions/:id",
    name: "questions view",
    element: <ViewQuestions />, //test
  },
  {
    path: "/add/questions",
    name: "questions add",
    element: <AddQuestions />, //test
  },
  {
    path: "/add/questions/:id",
    name: "questions add",
    element: <AddQuestions />, //test
  },
  {
    path: "/question/edit/:questionId",
    name: "Edit add",
    element: <UpdateQuestion />, //test
  },

  {
    path: "/survey",
    name: "survey",
    element: <Survey />,
  },
  {
    path: "/survey/answers/:surveyId",
    name: "Answers",
    element: <SurveyAnswers />,
  },
];

const memberShipRoutes = [
  {
    path: "/membership",
    name: "Membership",
    element: <Membership />,
  },
  {
    path: "/memberships/new",
    name: "New Membership ",
    element: <AddMembership />,
  },
  {
    path: "/memberships/edit/:id",
    name: "Membership Edit",
    element: <AddMembership />,
  },
  {
    path: "/test",
    name: "test",
    element: <Test />,
  },
];

const exclusiveMemberRoutes = [
  {
    path: "/exclusive-members",
    name: "Exclusive Members",
    element: <ExclusiveMembers />,
  },
  {
    path: "/exclusive-members/new",
    name: "New Membership ",
    element: <ExclusiveMembersForm />,
  },
  {
    path: "/exclusive-members/edit/:id",
    name: "Edit Membership ",
    element: <ExclusiveMembersForm />,
  },
];
const goldProgramRoutes = [
  {
    path: "/gold-programs",
    name: "Gold Programs",
    element: <GoldProgramsList />,
  },
  {
    path: "/gold-programs/new",
    name: "New Gold Program",
    element: <GoldProgramForm />,
  },
  {
    path: "/gold-programs/edit/:id",
    name: "Edit  Gold Program ",
    element: <GoldProgramForm />,
  },
  {
    path: "/gold-programs/:id",
    name: " Gold Program ",
    element: <GoldProgramDetails />,
  },
  {
    path: "/gold-programs/:programId/lots",
    name: " Gold Program ",
    element: <ProgramLotsList />,
  },
  {
    path: "/gold-programs/:programId/lots/new",
    name: " Gold Program ",
    element: <AssignLotForm />,
  },
  {
    path: "/gold-programs/:id/lots/:lotId/payments",
    name: " Gold Program ",
    element: <RecordPayment />,
  },
  {
    path: "/gold-programs/:programId/winners",
    name: " Gold Program ",
    element: <WinnersManagement />,
  },
];

const bookRoutes = [
  {
    path: "/book",
    name: "Book",
    element: <BookList />,
  },
  {
    path: "/book/new",
    name: "Book",
    element: <BookForm />,
  },
  {
    path: "/book/edit/:id",
    element: <BookForm />,
    name: "Edit  book ",
  },
  {
    path: "/book/:id",
    name: " Book details ",
    element: <BookDetails />,
  },
];
const committeeRoutes = [
  {
    path: "/constitution-committees",
    name: "CommitteeList",
    element: <CommitteeList />,
  },
  {
    path: "/constitution-committees/new",
    element: <CommitteeForm />,
    name: "CommitteeForm",
  },
  {
    path: "/constitution-committees/edit/:id",
    element: <CommitteeForm />,
    name: "CommitteeForm",
  },
  {
    path: "/constitution-committees/:committeeId",
    element: <CommitteeDetails />,
    name: "CommitteeDetails",
  },
  {
    path: "/constitution-committees/:committeeId/members/edit/:memberId",
    element: <MemberEditForm />,
    name: "MemberEditForm",
  },
];

const longInvestment = [
  {
    path: "/investments",
    name: "InvestmentList",
    element: <InvestmentList />,
  },
  {
    path: "/investments/new",
    element: <NewInvestmentForm />,
    name: "NewInvestmentForm",
  },
  {
    path: "/investments/:id",
    element: <InvestmentDetails />,
    name: "InvestmentDetails",
  },
  {
    path: "/investments/:id/deposits/new",
    element: <AddDepositForm />,
    name: "AddDepositForm",
  },
  {
    path: "/investments/:id/profits/new",
    element: <AddProfitForm />,
    name: "AddProfitForm",
  },
  {
    path: "/investments/:id/profit-payouts/new",
    element: <AddProfitPayoutForm />,
    name: "AddProfitPayoutForm",
  },
];
const subwingRoutes = [
  {
    path: "/sub-wing",
    name: "Sub wing",
    element: <SubWingList />,
  },
  {
    path: "/sub-wing/new",
    name: "Sub wing new",
    element: <SubWingForm />,
  },
  {
    path: "/sub-wing/edit/:id",
    name: "Sub wing edit",
    element: <SubWingForm />,
  },
  {
    path: "/sub-wing/:subWingId",
    name: "Sub wing ",
    element: <SubWingDetails />,
  },
];

const travelerRoutes = [
  {
    path: "/traveler",
    name: "Traveler",
    element: <TravelerList />,
  },
];

const notificationRoutes = [
  {
    path: "/notification",
    name: "NotificationList",
    element: <NotificationList />,
  },
];
// auth
const authRoutes = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
  },
  {
    path: "/auth/logout",
    name: "Logout",
    element: <Logout />,
  },
  {
    path: "/auth/forgot-password",
    name: "Forgot Password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
  },
];

// public routes
const otherPublicRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: <Error404 />,
  },
  {
    path: "pages/error-404",
    name: "Error - 404",
    element: <Error404 />,
  },
  {
    path: "pages/error-500",
    name: "Error - 500",
    element: <Error500 />,
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    element: <MaintenancePages />,
  },
];

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...uiRoutes,
  ...customPagesRoutes,
  ...appsRoutes,
  ...iconsRoutes,
  ...extendedRoutes,
  ...chartsRoutes,
  ...formsRoutes,
  ...tablesRoutes,
  ...mapsRoutes,
  ...userRoutes,
  ...bannerRoutes,
  ...eventRoutes,
  ...serviceRoutes,
  ...jobRoutes,
  ...newsRoutes,
  ...airportRoutes,
  ...surveyRoutes,
  ...memberShipRoutes,
  ...exclusiveMemberRoutes,
  ...goldProgramRoutes,
  ...subwingRoutes,
  ...bookRoutes,
  ...committeeRoutes,
  ...longInvestment,
  ...travelerRoutes,
  ...notificationRoutes,
];
export const publicRoutes = [...authRoutes, ...otherPublicRoutes];
