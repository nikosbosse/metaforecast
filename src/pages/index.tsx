import { NextPage } from "next";
import React from "react";

import { Layout } from "../web/display/Layout";
import { Props } from "../web/search/anySearchPage";
import { CommonDisplay } from "../web/search/CommonDisplay";

export { getServerSideProps } from "../web/search/anySearchPage";

const IndexPage: NextPage<Props> = (props) => {
  return (
    <Layout page="search">
      <CommonDisplay {...props} />
    </Layout>
  );
};

export default IndexPage;
