
import RulesPage from "@/components/rules/rulesPage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3 ">
      <PageBreadcrumb pageTitle="Quy định" />
      <RulesPage />
    </div>
  );
}
