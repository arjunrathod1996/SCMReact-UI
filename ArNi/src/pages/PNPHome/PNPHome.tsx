

import { useIntl } from "react-intl";
import { Col } from "reactstrap";
import styles from "./PNPHome.module.scss";
import ActionCard from "../../components/ActionCard/ActionCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RESOURCE } from "../../utils/constants";
import { PNPRoles } from "../../utils/Enums";
import { User } from "../../store";

const ROLES_ALLOWED_FOR_REPORT = [
  RESOURCE + PNPRoles.OWNER,
  RESOURCE + PNPRoles.PUBLISHER,
  RESOURCE + PNPRoles.CORRESPONDENT,
  RESOURCE + PNPRoles.SUPERUSER,
  RESOURCE + PNPRoles.OVER_SIGHT,
  RESOURCE + PNPRoles.CENTRAL_APPROVER,
  RESOURCE + PNPRoles.LOCAL_APPROVER,
];

function PNPHome({ user }: { user: User | null }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate(); // Initialize navigate function
  const onCreateHandler = () => {
    navigate("/pnp/create");
  };

  return (
    <div className="p-3 lg:ml-64 z-10 static" style={{ marginTop: "70px" }}>
      <div className={styles.welcome}>
        <Col md="12">
          <div className={styles.greeting}>
            {formatMessage({ id: "pnp.home.hi" })} {user?.name}!
          </div>
          <div className={styles.subtext}>
            {formatMessage({ id: "pnp.home.welcome" })}{" "}
            <span className={styles.highlight}>MyP&P</span>
          </div>
        </Col>
      </div>

      <div className="container mt-5">
        <div className="text-end">
          <button
            onClick={onCreateHandler}
            className="btn d-inline-flex align-items-center px-4 py-2 text-white  bg-blue-600 bg-primary border-0 rounded shadow-sm transition ease-in-out duration-300 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create
          </button>
        </div>
      </div>

      <div className={styles.flexContainer}>
        <div className={styles.columns}>
          <ActionCard
            id="my-pending-action"
            title={formatMessage({ id: "pnp.mypnp.pendingActions" })}
            subtitle="Pending Action item to be approved"
            icon="Pending_actions"
            backgroundColor="#fcf3ee"
            color="#6e777a"
            onClick={() => {
              navigate("/pnp/my-pending-action"); // Correct usage of navigate
            }}
          />
        </div>
        <div className={styles.columns}>
          <ActionCard
            id="my-pnp-scope"
            title={formatMessage({ id: "pnp.home.myPnP" })}
            subtitle="Pending Action item to be approved"
            icon="list_alt"
            backgroundColor="#e9f0ff"
            color="#2469ff"
            onClick={() => {
              navigate("/pnp/mypnp-scope"); // Correct usage of navigate
            }}
          />
        </div>
        {/* Add more ActionCard components as needed */}
        <div className={styles.columns}>
          <ActionCard
            id="mypnp-dispensation-list"
            title={formatMessage({ id: "pnp.home.myRequests" })}
            subtitle="New Action item"
            icon="edit"
            backgroundColor="#f3f4f6"
            color="#333"
            onClick={() => {
              navigate("/pnp/mypnp-dispensation-list"); // Correct usage of navigate
            }}
          />
        </div>
        <div className={styles.columns}>
          <ActionCard
            id="dashboard"
            title={formatMessage({ id: "pnp.home.pnpdashboard" })}
            subtitle="Archived Action item"
            icon="edit"
            backgroundColor="#e0e0e0"
            color="#555"
            onClick={() => {
              navigate("/pnp/my-archived-action"); // Correct usage of navigate
            }}
          />
        </div>
        <div className={styles.columns}>
          <ActionCard
            id="repository"
            title={formatMessage({ id: "pnp.home.repository" })}
            subtitle="Archived Action item"
            icon="edit"
            backgroundColor="#e0e0e0"
            color="#555"
            onClick={() => {
              navigate("/pnp/repository"); // Correct usage of navigate
            }}
          />
        </div>

        <div className={styles.columns}>
          <ActionCard
            id="my-archived-action"
            title={formatMessage({ id: "pnp.home.admin" })}
            subtitle="Archived Action item"
            icon="archived_action_icon"
            backgroundColor="#e0e0e0"
            color="#555"
            onClick={() => {
              navigate("/pnp/admin"); // Correct usage of navigate
            }}
          />
        </div>

        <div className={styles.columns}>
          <ActionCard
            id="my-archived-action"
            title={formatMessage({ id: "pnp.home.archivedAction" })}
            subtitle="Archived Action item"
            icon="archived_action_icon"
            backgroundColor="#e0e0e0"
            color="#555"
            onClick={() => {
              navigate("/pnp/content"); // Correct usage of navigate
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PNPHome;

