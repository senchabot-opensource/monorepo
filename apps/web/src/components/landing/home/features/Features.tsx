import { Stack } from "@mui/material";
import SectionLayout from "../../layout/SectionLayout";
import FeaturesCard from "./FeatruesCard";

const Features = () => {
  return (
    <SectionLayout>
      <Stack pt="103px" pb="103px">
        <FeaturesCard
          title="Keep Your Community Clean with Simplified Moderation tools!"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus mauris, varius at massa sit amet, vestibulum ultricies turpis. Duis porttitor lectus in luctus placerat. In hac habitasse platea dictumst."
          imageAlt=""
          imageURL=""
          reverse={false}
        />
      </Stack>
      <Stack
        pt="103px"
        pb="103px"
        direction="row"
        bgcolor="rgba(0, 59, 67, 0.10)"
        width="100%"
        justifyContent="center">
        <FeaturesCard
          title="Enhance your Community with customizable features!"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus mauris, varius at massa sit amet, vestibulum ultricies turpis. Duis porttitor lectus in luctus placerat. In hac habitasse platea dictumst."
          imageAlt=""
          imageURL=""
          reverse={true}
        />
      </Stack>
      <Stack pt="103px" pb="103px">
        <FeaturesCard
          title="Focus on having fun with your audience"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus mauris, varius at massa sit amet, vestibulum ultricies turpis. Duis porttitor lectus in luctus placerat. In hac habitasse platea dictumst."
          imageAlt=""
          imageURL=""
          reverse={false}
        />
      </Stack>
      <Stack
        pt="103px"
        pb="103px"
        direction="row"
        bgcolor="rgba(0, 59, 67, 0.10)"
        width="100%"
        justifyContent="center">
        <FeaturesCard
          title="Multi-platform features"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus mauris, varius at massa sit amet, vestibulum ultricies turpis. Duis porttitor lectus in luctus placerat. In hac habitasse platea dictumst."
          imageAlt=""
          imageURL=""
          reverse={true}
        />
      </Stack>
      <Stack pt="103px" pb="103px">
        <FeaturesCard
          title="Customizable and lightning-fast notifications"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus mauris, varius at massa sit amet, vestibulum ultricies turpis. Duis porttitor lectus in luctus placerat. In hac habitasse platea dictumst."
          imageAlt=""
          imageURL=""
          reverse={false}
        />
      </Stack>
    </SectionLayout>
  );
};

export default Features;
