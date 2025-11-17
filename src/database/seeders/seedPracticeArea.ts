// src/db/seeds/seedPracticeArea.ts
import colors from "colors";
import { logger } from "../../shared/utils/logger";
import { PracticeArea } from "../../features/practice_areas/practiceArea.model";

const practiceAreaSeedData = [
  {
    title: "Criminal Defense",
    description:
      "Federal & State Criminal Defense, DUI, Drug Offenses, Violent Crimes, Theft, Domestic Violence, and more.",
    image: "",
    status: "active",
  },
  {
    title: "White Collar Defense",
    description:
      "Securities fraud, tax evasion, embezzlement, money laundering, insider trading, and corporate crimes.",
    image: "",
    // http://localhost:3000/practice-test.png
    status: "active",
  },
];

const seedPracticeArea = async () => {
  try {
    for (const practiceAreaData of practiceAreaSeedData) {
      // Check if practice area already exists
      const isExistPracticeArea = await PracticeArea.findOne({
        title: practiceAreaData.title,
      });

      if (!isExistPracticeArea) {
        await PracticeArea.create(practiceAreaData);
        logger.info(
          colors.green(
            `✔ Practice Area (${practiceAreaData.title}) created successfully!`
          )
        );
      } else {
        logger.info(
          colors.yellow(
            `Practice Area (${practiceAreaData.title}) already exists.`
          )
        );
      }
    }
  } catch (error) {
    logger.error(colors.red("Error creating practice areas:"), error);
  }
};

export default seedPracticeArea;
