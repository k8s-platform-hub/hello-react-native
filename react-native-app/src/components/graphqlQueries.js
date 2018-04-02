import gql from 'graphql-tag';

const FETCH_USER_DETAILS= gql`
  query fetch_user_details{
    user_details {
      user_id
      name
      gender
      education {
        id
        institution_name
        degree
      }
    }
  }
`;

const INSERT_USER_DETAILS = gql`
  mutation insert_user_details($objects: [user_details_input!]){
    insert_user_details(objects: $objects) {
      affected_rows
      returning {
        user_id
      }
    }
  }
`;

const INSERT_USER_EDUCATION = gql`
  mutation insert_user_education($objects: [user_education_input!]){
    insert_user_education(objects: $objects) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export {
  INSERT_USER_DETAILS,
  INSERT_USER_EDUCATION,
  FETCH_USER_DETAILS
}
