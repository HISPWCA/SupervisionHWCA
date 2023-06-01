import { NoticeBox } from "@dhis2/ui"
import { NOTICE_BOX_DEFAULT, NOTICE_BOX_ERROR, NOTICE_BOX_VALID, NOTICE_BOX_WARNING } from "../utils/constants"

export const MyNoticeBox = ({ show, title, message, type }) => {
    return show ? (
        <NoticeBox
            title={title}
            warning={type === NOTICE_BOX_WARNING}
            valid={type === NOTICE_BOX_VALID}
            default={type === NOTICE_BOX_DEFAULT}
            error={type === NOTICE_BOX_ERROR}
        >
            {message}
        </NoticeBox>
    ) :
        (<></>)
}