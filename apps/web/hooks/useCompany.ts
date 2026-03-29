import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setProfile, setLoading } from "../store/slices/companySlice";
import { companyService } from "../services/company.service";

export function useCompany() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.company);

  const fetchProfile = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await companyService.getProfile();
      dispatch(setProfile(data));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { profile, loading, fetchProfile };
}
