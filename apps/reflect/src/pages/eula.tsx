import { Typography } from "@mui/material";
import Header from "../components/common/Header";
import LandingContainer from "../components/landing/LandingContainer";

const EULA = () => {
  return (
    <>
      <Header title="End-User License Agreement (EULA)" index={false}></Header>
      <LandingContainer>
        <Typography variant="h4">
          END-USER LICENSE AGREEMENT (EULA) for Senchabot
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          IMPORTANT: PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING
          SENCHABOT.
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          This End-User License Agreement (&quot;EULA&quot;) is a legal
          agreement between you (either an individual or a single entity) and
          the Senchabot team, for the Senchabot software product
          (&quot;Software&quot;) identified above, including any associated
          media, printed materials and electronic documentation (collectively
          &quot;Senchabot&quot;). By installing, copying, or otherwise using
          Senchabot, you agree to be bound by the terms of this EULA. If you do
          not agree to the terms of this EULA, do not use Senchabot.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          1. GRANT OF LICENSE
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          Senchabot is licensed, not sold. The Senchabot team grants you a
          non-exclusive, non-transferable, limited license to use Senchabot in
          accordance with this EULA. You may use Senchabot for personal or
          commercial purposes, subject to the limitations described in this
          EULA.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          2. COPYRIGHT AND OWNERSHIP
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          This EULA does not grant you any ownership interest in Senchabot, but
          only a limited right of use.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          3. RESTRICTIONS
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          You may not copy, modify, distribute, sell or transfer Senchabot or
          any portion thereof without the express written permission of the
          Senchabot team. You may not reverse engineer, decompile, or
          disassemble Senchabot or any portion thereof, except to the extent
          such activity is expressly permitted by applicable law. You may not
          remove, alter, or obscure any copyright, trademark, or other
          proprietary rights notice on or in Senchabot. You may not use
          Senchabot in any manner that could damage, disable, overburden, or
          impair Senchabot or interfere with any other party&ldquo;s use and
          enjoyment of Senchabot.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          4. WARRANTY DISCLAIMER
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          Senchabot is provided &quot;AS IS&quot; without warranty of any kind,
          either express or implied, including, but not limited to, the implied
          warranties of merchantability and fitness for a particular purpose.
          The Senchabot team does not warrant that Senchabot will meet your
          requirements or that the operation of Senchabot will be uninterrupted
          or error-free.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          5. LIMITATION OF LIABILITY
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          In no event shall the Senchabot team be liable for any indirect,
          special, incidental, punitive, or consequential damages arising out of
          or in connection with this EULA or the use of Senchabot, including,
          without limitation, damages for loss of profits, loss of data, or loss
          of use, even if the Senchabot team has been advised of the possibility
          of such damages. In no event shall the Senchabot team&lsquo;s
          liability exceed the amount you paid for Senchabot.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          6. TERMINATION
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          This EULA will terminate automatically if you fail to comply with any
          of the terms and conditions of this EULA. Upon termination, you must
          immediately cease using Senchabot and destroy all copies of Senchabot
          in your possession or control.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          7. MISCELLANEOUS
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          This EULA constitutes the entire agreement between you and the
          Senchabot team with respect to the use of Senchabot and supersedes all
          prior or contemporaneous communications and proposals, whether oral or
          written, between you and the Senchabot team with respect to Senchabot.
          If any provision of this EULA is found to be invalid or unenforceable,
          the remaining provisions shall remain in full force and effect. The
          failure of the Senchabot team to enforce any right or provision of
          this EULA shall not constitute a waiver of such right or provision.
          This EULA may not be amended or modified except in writing signed by
          both you and the Senchabot team.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          By using Senchabot, you agree to be bound by the terms of this EULA.
          If you have any questions about this EULA or Senchabot, please contact
          the Senchabot team at <strong>hello@senchabot.app</strong>
        </Typography>
      </LandingContainer>
    </>
  );
};

export default EULA;
