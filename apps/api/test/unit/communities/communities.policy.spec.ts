import { ForbiddenException } from '@nestjs/common';
import { CommunitiesPolicy } from '../../../src/modules/communities/policies/communities.policy';
import { Community } from '@prisma/client';

describe('CommunitiesPolicy', () => {
  let policy: CommunitiesPolicy;

  beforeEach(() => {
    policy = new CommunitiesPolicy();
  });

  it('permite gestionar si el usuario es el owner', () => {
    const community = { ownerId: 'user-1' } as Community;
    expect(() => policy.assertCanManage(community, 'user-1')).not.toThrow();
  });

  it('rechaza gestionar si el usuario NO es el owner', () => {
    const community = { ownerId: 'user-1' } as Community;
    expect(() => policy.assertCanManage(community, 'user-2')).toThrow(ForbiddenException);
  });
});
