import colors from 'colors';import config from '../../config';
import { logger } from '../../shared/utils/logger';
import { User } from '../../features/user/user.model';
import { USER_ROLE } from "../../shared/enums/user";

const superUser = {
  fullName: config.admin.name,
  role: USER_ROLE.ADMIN,
  email: config.admin.email,
  password: config.admin.password,
  phone_number: "",
  verified: true,
  isOnline: true,
  isSubscribed: true,
};

const seedAdmin = async () => {
  try {
    const isExistSuperAdmin = await User.findOne({ role: USER_ROLE.ADMIN });

    if (!isExistSuperAdmin) {
      await User.create(superUser);
      logger.info(colors.green('✔ admin created successfully!'));
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

export default seedAdmin;
